'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccountContext } from '../AccountProvider';
import { createPage, fetchPagesByArtist, updatePage } from '../../../lib/api/pages';
import type { PageDefinition, PageSection } from '../../../lib/types';
import { pageDefinitionSchema } from '../../../lib/schemas/page';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { sortableKeyboardCoordinates } from '@dnd-kit/accessibility';
import { CSS } from '@dnd-kit/utilities';
import { FiAlertTriangle, FiCopy, FiDelete, FiEdit, FiPlus, FiSearch } from 'react-icons/fi';
import { trackEvent } from '../../../lib/telemetry';

interface SectionTemplate {
  type: PageSection['type'];
  label: string;
  description: string;
  icon: typeof FiPlus;
  build: () => PageSection;
}

const SECTION_LIBRARY: SectionTemplate[] = [
  {
    type: 'hero',
    label: 'Hero immersif',
    description: 'Grand titre, sous-titre et visuel plein écran',
    icon: FiEdit,
    build: () => ({
      id: crypto.randomUUID(),
      type: 'hero',
      isVisible: true,
      data: {
        heading: 'Titre de la page',
        subheading: 'Décrivez votre univers en une phrase',
        backgroundImage: ''
      }
    })
  },
  {
    type: 'gallery',
    label: 'Galerie',
    description: 'Grille d’œuvres avec images et légendes',
    icon: FiCopy,
    build: () => ({
      id: crypto.randomUUID(),
      type: 'gallery',
      isVisible: true,
      data: {
        title: 'Collection récente',
        images: [
          { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6', caption: 'Œuvre 1' }
        ]
      }
    })
  },
  {
    type: 'quote',
    label: 'Citation',
    description: 'Mettre en avant une phrase signature',
    icon: FiAlertTriangle,
    build: () => ({
      id: crypto.randomUUID(),
      type: 'quote',
      isVisible: true,
      data: {
        quote: 'Chaque création est une fenêtre vers un nouveau monde.',
        author: 'Artiste'
      }
    })
  },
  {
    type: 'cta',
    label: 'Call-to-action',
    description: 'Bouton vers contact, achat ou réservation',
    icon: FiPlus,
    build: () => ({
      id: crypto.randomUUID(),
      type: 'cta',
      isVisible: true,
      data: {
        title: 'Collaborer',
        buttonLabel: 'Me contacter',
        buttonHref: '/contact'
      }
    })
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Placeholder de formulaire ou coordonnées',
    icon: FiSearch,
    build: () => ({
      id: crypto.randomUUID(),
      type: 'contact',
      isVisible: true,
      data: {
        title: 'Contact',
        instructions: 'Décrivez comment vous contacter',
        email: ''
      }
    })
  }
];

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

interface AutosaveState {
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt?: Date;
  error?: string;
}

export function PageBuilderShell() {
  const { selectedArtist, overview } = useAccountContext();
  const [selectedPageId, setSelectedPageId] = useState<string>();
  const [selectedSectionId, setSelectedSectionId] = useState<string>();
  const [draft, setDraft] = useState<PageDefinition | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [autosaveState, setAutosaveState] = useState<AutosaveState>({ isDirty: false, isSaving: false });
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const artistId = selectedArtist?.id;
  const { isOpen: isLibraryOpen, onToggle: toggleLibrary } = useDisclosure({ defaultIsOpen: true });

  const { data: pages, isLoading } = useQuery<PageDefinition[]>({
    queryKey: ['pages', artistId],
    queryFn: () => fetchPagesByArtist(artistId as string),
    enabled: Boolean(artistId),
    staleTime: 10_000
  });

  const { mutateAsync: createPageMutation, isLoading: isCreating } = useMutation(
    ({ artistId: mutationArtistId, payload }: { artistId: string; payload: { title: string; slug: string; seoDescription?: string } }) =>
      createPage(mutationArtistId, payload),
    {
      onSuccess: async (page) => {
      await queryClient.invalidateQueries({ queryKey: ['pages', artistId] });
      setSelectedPageId(page.id);
      setDraft(page);
      setSelectedSectionId(page.sections[0]?.id);
      setAutosaveState({ isDirty: false, isSaving: false, lastSavedAt: new Date() });
    }
    }
  );

  const updateMutation = useMutation(
    ({ pageId, payload }: { pageId: string; payload: ReturnType<typeof mapDraftToPayload> }) => updatePage(pageId, payload),
    {
      onSuccess: async (page) => {
      setAutosaveState((state) => ({ ...state, isSaving: false, isDirty: false, lastSavedAt: new Date(), error: undefined }));
      await queryClient.setQueryData<PageDefinition[]>(['pages', artistId], (existing) => {
        if (!existing) return existing;
        return existing.map((item) => (item.id === page.id ? page : item));
      });
      setDraft(page);
    },
    onError: (error: Error) => {
      setAutosaveState((state) => ({ ...state, isSaving: false, error: error.message }));
      toast({ status: 'error', title: 'Sauvegarde échouée', description: error.message });
    }
    }
  );

  useEffect(() => {
    if (pages && !selectedPageId && pages.length > 0) {
      setSelectedPageId(pages[0].id);
      setSelectedSectionId(pages[0].sections[0]?.id);
    }
  }, [pages, selectedPageId]);

  useEffect(() => {
    if (!pages) return;
    const nextPage = pages.find((page) => page.id === selectedPageId);
    if (nextPage) {
      setDraft(cloneValue(nextPage));
      setAutosaveState((state) => ({ ...state, isDirty: false, isSaving: false, error: undefined }));
    } else {
      setDraft(undefined);
    }
  }, [pages, selectedPageId]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (autosaveState.isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [autosaveState.isDirty]);

  useEffect(() => {
    if (!autosaveState.isDirty || !draft) {
      setShowUnsavedWarning(false);
      return;
    }
    setShowUnsavedWarning(true);
    const timeout = setTimeout(() => {
      void triggerSave('autosave');
    }, 10_000);
    return () => clearTimeout(timeout);
  }, [autosaveState.isDirty, draft]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const isSaveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's';
      if (isSaveShortcut) {
        event.preventDefault();
        void triggerSave('manual');
      }
      if (event.key.toLowerCase() === 'a' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        toggleLibrary();
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [toggleLibrary]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const triggerSave = useCallback(
    async (origin: 'autosave' | 'manual' | 'publish', override?: PageDefinition) => {
      const pageToPersist = override ?? draft;
      if (!pageToPersist) return;
      const result = pageDefinitionSchema.safeParse(pageToPersist);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? 'Validation échouée';
        toast({ status: 'warning', title: 'Champs invalides', description: message });
        return;
      }
      setAutosaveState((state) => ({ ...state, isSaving: true }));
      trackEvent('builder.autosave_attempt', { origin, pageId: pageToPersist.id });
      await updateMutation.mutateAsync({ pageId: pageToPersist.id, payload: mapDraftToPayload(pageToPersist) });
    },
    [draft, toast, updateMutation]
  );

  const setDirtyDraft = useCallback(
    (updater: (previous: PageDefinition) => PageDefinition): PageDefinition | undefined => {
      let nextPage: PageDefinition | undefined;
      setDraft((current) => {
        if (!current) return current;
        const next = updater(cloneValue(current));
        nextPage = next;
        setAutosaveState((state) => ({ ...state, isDirty: true }));
        return next;
      });
      return nextPage;
    },
    []
  );

  const handleAddSection = useCallback(
    (template: SectionTemplate) => {
      if (!draft) return;
      trackEvent('builder.section_add', { pageId: draft.id, type: template.type });
      const newSection = template.build();
      setDirtyDraft((page) => {
        page.sections.push(newSection);
        return page;
      });
      setSelectedSectionId(newSection.id);
    },
    [draft, setDirtyDraft]
  );

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      if (!draft) return;
      setDirtyDraft((page) => {
        page.sections = page.sections.filter((section) => section.id !== sectionId);
        return page;
      });
    },
    [draft, setDirtyDraft]
  );

  const handleSectionChange = useCallback(
    (sectionId: string, updater: (section: PageSection) => PageSection) => {
      if (!draft) return;
      setDirtyDraft((page) => {
        page.sections = page.sections.map((section) => (section.id === sectionId ? updater(section) : section));
        return page;
      });
    },
    [draft, setDirtyDraft]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!draft) return;
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = draft.sections.findIndex((section) => section.id === active.id);
      const newIndex = draft.sections.findIndex((section) => section.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      trackEvent('builder.section_reorder', { pageId: draft.id, from: oldIndex, to: newIndex });
      setDirtyDraft((page) => {
        page.sections = arrayMove(page.sections, oldIndex, newIndex);
        return page;
      });
    },
    [draft, setDirtyDraft]
  );

  const handleMetadataChange = useCallback(
    (key: keyof Pick<PageDefinition, 'title' | 'slug' | 'seoDescription'>, value: string) => {
      setDirtyDraft((page) => {
        (page as any)[key] = value;
        return page;
      });
    },
    [setDirtyDraft]
  );

  const handleStatusToggle = useCallback(
    (isPublished: boolean) => {
      if (!draft) return;
      const updated = setDirtyDraft((page) => {
        page.status = isPublished ? 'published' : 'draft';
        return page;
      });
      if (updated) {
        void triggerSave('publish', updated);
      }
    },
    [draft, triggerSave, setDirtyDraft]
  );

  const filteredPages = useMemo(() => {
    if (!pages) return [];
    const lower = searchTerm.toLowerCase();
    return pages.filter((page) => page.title.toLowerCase().includes(lower) || page.slug.toLowerCase().includes(lower));
  }, [pages, searchTerm]);

  const selectedSection = draft?.sections.find((section) => section.id === selectedSectionId);

  useEffect(() => {
    if (!draft) return;
    if (!selectedSectionId || draft.sections.some((section) => section.id === selectedSectionId)) {
      return;
    }
    setSelectedSectionId(draft.sections[0]?.id);
  }, [draft, selectedSectionId]);

  const publishLabel = draft?.status === 'published' ? 'Publié' : 'Brouillon';

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #0b0418, #1b0f3d)" color="gray.100" py={10} px={{ base: 4, lg: 10 }}>
      <Stack spacing={8} maxW="7xl" mx="auto">
        <HStack spacing={4} align={{ base: 'flex-start', md: 'center' }} flexDir={{ base: 'column', md: 'row' }}>
          <Stack spacing={1}>
            <Text fontSize="sm" color="purple.200">
              Page Builder
            </Text>
            <Heading size="lg">Composez vos pages en drag-and-drop</Heading>
            <Text color="gray.300">Plan actuel : {overview?.account.plan.name} — Artiste sélectionné : {selectedArtist?.name}</Text>
          </Stack>
          <Spacer />
          <Stack align="flex-end" spacing={2}>
            <HStack>
              {autosaveState.isSaving && (
                <HStack spacing={2} color="purple.200">
                  <Spinner size="sm" />
                  <Text fontSize="sm">Sauvegarde en cours…</Text>
                </HStack>
              )}
              {!autosaveState.isSaving && autosaveState.lastSavedAt && (
                <Text fontSize="sm" color="gray.400">
                  Dernière sauvegarde {autosaveState.lastSavedAt.toLocaleTimeString('fr-FR')}
                </Text>
              )}
            </HStack>
            {autosaveState.error && (
              <Alert status="error" borderRadius="lg" variant="left-accent">
                <AlertIcon />
                <AlertDescription>{autosaveState.error}</AlertDescription>
              </Alert>
            )}
          </Stack>
        </HStack>

        {showUnsavedWarning && (
          <Alert status="warning" borderRadius="2xl" variant="left-accent">
            <AlertIcon />
            <AlertDescription>Des modifications non sauvegardées seront synchronisées automatiquement.</AlertDescription>
          </Alert>
        )}

        <Grid templateColumns={{ base: '1fr', xl: '260px 1fr 360px' }} gap={8} alignItems="flex-start">
          <GridItem>
            <Stack spacing={4} bg="rgba(14, 10, 30, 0.85)" borderRadius="2xl" p={6} borderWidth="1px" borderColor="whiteAlpha.200">
              <HStack justify="space-between">
                <Heading size="sm">Navigation</Heading>
                <Badge colorScheme="purple">{filteredPages.length}</Badge>
              </HStack>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher une page"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </InputGroup>
              <Stack spacing={2} maxH="360px" overflowY="auto">
                {isLoading && (
                  <Stack>
                    <Skeleton height="48px" borderRadius="lg" />
                    <Skeleton height="48px" borderRadius="lg" />
                  </Stack>
                )}
                {!isLoading && filteredPages.length === 0 && (
                  <Text fontSize="sm" color="gray.400">
                    Aucune page pour le moment.
                  </Text>
                )}
                {filteredPages.map((page) => (
                  <Button
                    key={page.id}
                    variant={page.id === selectedPageId ? 'solid' : 'ghost'}
                    colorScheme="purple"
                    justifyContent="space-between"
                    onClick={() => {
                      setSelectedPageId(page.id);
                      setSelectedSectionId(page.sections[0]?.id);
                    }}
                  >
                    <Stack spacing={0} align="flex-start">
                      <Text>{page.title}</Text>
                      <Text fontSize="xs" color="gray.400">
                        /{page.slug}
                      </Text>
                    </Stack>
                    <Badge colorScheme={page.status === 'published' ? 'green' : 'gray'}>{page.status}</Badge>
                  </Button>
                ))}
              </Stack>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="purple"
                onClick={async () => {
                  if (!artistId) return;
                  const slug = `nouvelle-page-${Date.now().toString().slice(-4)}`;
                  await createPageMutation({ artistId, payload: { title: 'Nouvelle page', slug } });
                }}
                isLoading={isCreating}
              >
                Nouvelle page
              </Button>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={6}>
              <Stack spacing={4} bg="rgba(18, 12, 40, 0.85)" borderRadius="2xl" p={6} borderWidth="1px" borderColor="whiteAlpha.200">
                <HStack justify="space-between" align="flex-start">
                  <Stack spacing={1}>
                    <Heading size="sm">Sections</Heading>
                    <Text fontSize="sm" color="gray.400">
                      Glissez-déposez pour réordonner. Appuyez sur « A » pour ouvrir la bibliothèque.
                    </Text>
                  </Stack>
                  <Button size="sm" variant="ghost" leftIcon={<FiPlus />} onClick={toggleLibrary}>
                    {isLibraryOpen ? 'Masquer la bibliothèque' : 'Ajouter une section'}
                  </Button>
                </HStack>
                {isLibraryOpen && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {SECTION_LIBRARY.map((template) => (
                      <Button
                        key={template.type}
                        variant="outline"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={template.icon} />}
                        onClick={() => handleAddSection(template)}
                      >
                        <Stack spacing={0} align="flex-start">
                          <Text>{template.label}</Text>
                          <Text fontSize="xs" color="gray.400">
                            {template.description}
                          </Text>
                        </Stack>
                      </Button>
                    ))}
                  </SimpleGrid>
                )}
                <Divider borderColor="whiteAlpha.200" />
                {draft ? (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={draft.sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
                      <Stack spacing={3}>
                        {draft.sections.map((section) => (
                          <SortableSectionCard
                            key={section.id}
                            section={section}
                            isActive={selectedSectionId === section.id}
                            onSelect={() => setSelectedSectionId(section.id)}
                            onRemove={() => handleRemoveSection(section.id)}
                          />
                        ))}
                      </Stack>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <Stack spacing={3}>
                    <Text fontSize="sm" color="gray.400">
                      Sélectionnez ou créez une page pour commencer.
                    </Text>
                  </Stack>
                )}
              </Stack>

              {draft && <PreviewPane page={draft} />}
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={6} position="sticky" top={10}>
              <Stack spacing={4} bg="rgba(18, 12, 40, 0.85)" borderRadius="2xl" p={6} borderWidth="1px" borderColor="whiteAlpha.200">
                <Heading size="sm">Paramètres de la page</Heading>
                {draft ? (
                  <Stack spacing={4}>
                    <Input
                      value={draft.title}
                      onChange={(event) => handleMetadataChange('title', event.target.value)}
                      placeholder="Titre de la page"
                    />
                    <Input
                      value={draft.slug}
                      onChange={(event) => handleMetadataChange('slug', event.target.value)}
                      placeholder="Slug (URL)"
                    />
                    <Textarea
                      value={draft.seoDescription ?? ''}
                      onChange={(event) => handleMetadataChange('seoDescription', event.target.value)}
                      placeholder="Description SEO"
                      rows={4}
                    />
                    <HStack justify="space-between">
                      <Stack spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          Statut
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {publishLabel}
                        </Text>
                      </Stack>
                      <Switch
                        colorScheme="purple"
                        isChecked={draft.status === 'published'}
                        onChange={(event) => handleStatusToggle(event.target.checked)}
                      />
                    </HStack>
                    <Button colorScheme="purple" onClick={() => triggerSave('manual')} isDisabled={!autosaveState.isDirty}>
                      Sauvegarder maintenant
                    </Button>
                  </Stack>
                ) : (
                  <Text fontSize="sm" color="gray.400">
                    Aucun brouillon sélectionné.
                  </Text>
                )}
              </Stack>

              <Stack spacing={4} bg="rgba(18, 12, 40, 0.85)" borderRadius="2xl" p={6} borderWidth="1px" borderColor="whiteAlpha.200">
                <Heading size="sm">Inspecteur de section</Heading>
                {selectedSection && draft ? (
                  <SectionInspector section={selectedSection} onChange={handleSectionChange} />
                ) : (
                  <Text fontSize="sm" color="gray.400">
                    Sélectionnez une section pour modifier son contenu.
                  </Text>
                )}
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  );
}

function mapDraftToPayload(draft: PageDefinition) {
  return {
    title: draft.title,
    slug: draft.slug,
    seoDescription: draft.seoDescription,
    status: draft.status ?? 'draft',
    sections: draft.sections.map((section) => ({
      id: section.id,
      type: section.type,
      data: section.data,
      isVisible: section.isVisible
    }))
  };
}

interface SortableSectionCardProps {
  section: PageSection;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableSectionCard({ section, isActive, onSelect, onRemove }: SortableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <Box
      ref={setNodeRef}
      style={style}
      borderWidth="1px"
      borderColor={isActive ? 'purple.400' : 'whiteAlpha.200'}
      borderRadius="xl"
      bg={isActive ? 'rgba(124, 58, 237, 0.2)' : 'rgba(20, 14, 42, 0.85)'}
      p={4}
      cursor={isDragging ? 'grabbing' : 'grab'}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      <HStack justify="space-between" align="flex-start">
        <Stack spacing={1}>
          <Text fontWeight="semibold">{formatSectionLabel(section.type)}</Text>
          <Text fontSize="sm" color="gray.400">
            {summarizeSection(section)}
          </Text>
        </Stack>
        <Tooltip label="Supprimer la section" placement="left">
          <IconButton aria-label="Supprimer" icon={<FiDelete />} size="sm" variant="ghost" onClick={onRemove} />
        </Tooltip>
      </HStack>
    </Box>
  );
}

interface SectionInspectorProps {
  section: PageSection;
  onChange: (sectionId: string, updater: (section: PageSection) => PageSection) => void;
}

function SectionInspector({ section, onChange }: SectionInspectorProps) {
  switch (section.type) {
    case 'hero':
      return (
        <Stack spacing={3}>
          <Input
            value={section.data.heading}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, heading: event.target.value }
            }))}
            placeholder="Titre principal"
          />
          <Textarea
            value={section.data.subheading ?? ''}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, subheading: event.target.value }
            }))}
            placeholder="Sous-titre"
          />
          <Input
            value={section.data.backgroundImage ?? ''}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, backgroundImage: event.target.value }
            }))}
            placeholder="URL du visuel"
          />
        </Stack>
      );
    case 'gallery':
      return (
        <Stack spacing={4}>
          <Input
            value={section.data.title}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, title: event.target.value }
            }))}
            placeholder="Titre de la galerie"
          />
          <Stack spacing={3}>
            {section.data.images.map((image: any, index: number) => (
              <Stack key={image.id} spacing={2} borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="lg" p={3}>
                <Text fontSize="xs" color="gray.400">
                  Image #{index + 1}
                </Text>
                <Input
                  value={image.url}
                  onChange={(event) =>
                    onChange(section.id, (current) => ({
                      ...current,
                      data: {
                        ...current.data,
                        images: current.data.images.map((item: any) =>
                          item.id === image.id ? { ...item, url: event.target.value } : item
                        )
                      }
                    }))
                  }
                  placeholder="URL de l'image"
                />
                <Input
                  value={image.caption ?? ''}
                  onChange={(event) =>
                    onChange(section.id, (current) => ({
                      ...current,
                      data: {
                        ...current.data,
                        images: current.data.images.map((item: any) =>
                          item.id === image.id ? { ...item, caption: event.target.value } : item
                        )
                      }
                    }))
                  }
                  placeholder="Légende"
                />
              </Stack>
            ))}
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FiPlus />}
              onClick={() =>
                onChange(section.id, (current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    images: [
                      ...current.data.images,
                      {
                        id: crypto.randomUUID(),
                        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                        caption: 'Nouvelle image'
                      }
                    ]
                  }
                }))
              }
            >
              Ajouter une image
            </Button>
          </Stack>
        </Stack>
      );
    case 'quote':
      return (
        <Stack spacing={3}>
          <Textarea
            value={section.data.quote}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, quote: event.target.value }
            }))}
            placeholder="Texte de la citation"
          />
          <Input
            value={section.data.author ?? ''}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, author: event.target.value }
            }))}
            placeholder="Auteur"
          />
        </Stack>
      );
    case 'cta':
      return (
        <Stack spacing={3}>
          <Input
            value={section.data.title}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, title: event.target.value }
            }))}
            placeholder="Titre"
          />
          <Input
            value={section.data.buttonLabel}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, buttonLabel: event.target.value }
            }))}
            placeholder="Texte du bouton"
          />
          <Input
            value={section.data.buttonHref}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, buttonHref: event.target.value }
            }))}
            placeholder="Lien"
          />
        </Stack>
      );
    case 'contact':
      return (
        <Stack spacing={3}>
          <Input
            value={section.data.title}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, title: event.target.value }
            }))}
            placeholder="Titre"
          />
          <Textarea
            value={section.data.instructions ?? ''}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, instructions: event.target.value }
            }))}
            placeholder="Instructions"
          />
          <Input
            value={section.data.email ?? ''}
            onChange={(event) => onChange(section.id, (current) => ({
              ...current,
              data: { ...current.data, email: event.target.value }
            }))}
            placeholder="Email"
          />
        </Stack>
      );
    default:
      return <Text>Section non prise en charge.</Text>;
  }
}

function PreviewPane({ page }: { page: PageDefinition }) {
  return (
    <Stack spacing={4} bg="rgba(18, 12, 40, 0.85)" borderRadius="2xl" p={6} borderWidth="1px" borderColor="whiteAlpha.200">
      <Heading size="sm">Prévisualisation</Heading>
      <Stack spacing={5} bg="linear-gradient(135deg, rgba(26, 12, 52, 0.9), rgba(11, 6, 28, 0.95))" borderRadius="xl" p={6}>
        {page.sections.map((section) => (
          <Box key={section.id} borderRadius="lg" borderWidth="1px" borderColor="whiteAlpha.200" p={5}>
            {renderPreviewSection(section)}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

function renderPreviewSection(section: PageSection) {
  switch (section.type) {
    case 'hero':
      return (
        <Stack spacing={2} textAlign="center">
          <Heading size="lg">{section.data.heading}</Heading>
          {section.data.subheading && (
            <Text color="gray.300" fontSize="lg">
              {section.data.subheading}
            </Text>
          )}
          {section.data.backgroundImage && (
            <Box
              mt={4}
              borderRadius="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              bgImage={`url(${section.data.backgroundImage})`}
              bgSize="cover"
              bgPos="center"
              minH="160px"
            />
          )}
        </Stack>
      );
    case 'gallery':
      return (
        <Stack spacing={3}>
          <Heading size="md">{section.data.title}</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
            {section.data.images.map((image: any) => (
              <Box key={image.id} borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor="whiteAlpha.200">
                <Box bgImage={`url(${image.url})`} bgSize="cover" bgPos="center" minH="120px" />
                {image.caption && (
                  <Text fontSize="sm" px={2} py={1} color="gray.300">
                    {image.caption}
                  </Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      );
    case 'quote':
      return (
        <Stack spacing={2} textAlign="center">
          <Text fontStyle="italic" fontSize="lg">
            “{section.data.quote}”
          </Text>
          {section.data.author && <Text color="gray.400">— {section.data.author}</Text>}
        </Stack>
      );
    case 'cta':
      return (
        <Stack spacing={3} align="center">
          <Heading size="md">{section.data.title}</Heading>
          <Button colorScheme="purple" size="lg">
            {section.data.buttonLabel}
          </Button>
        </Stack>
      );
    case 'contact':
      return (
        <Stack spacing={2}>
          <Heading size="md">{section.data.title}</Heading>
          {section.data.instructions && <Text color="gray.300">{section.data.instructions}</Text>}
          {section.data.email && (
            <Text color="purple.200" fontWeight="semibold">
              {section.data.email}
            </Text>
          )}
          {!section.data.email && <Text color="gray.400">Formulaire à venir…</Text>}
        </Stack>
      );
    default:
      return <Text>Section non prise en charge.</Text>;
  }
}

function formatSectionLabel(type: PageSection['type']) {
  switch (type) {
    case 'hero':
      return 'Hero';
    case 'gallery':
      return 'Galerie';
    case 'quote':
      return 'Citation';
    case 'cta':
      return 'Call-to-action';
    case 'contact':
      return 'Contact';
    default:
      return type;
  }
}

function summarizeSection(section: PageSection) {
  switch (section.type) {
    case 'hero':
      return section.data.heading;
    case 'gallery':
      return `${section.data.images.length} visuels`;
    case 'quote':
      return section.data.author ?? 'Sans auteur';
    case 'cta':
      return section.data.buttonLabel;
    case 'contact':
      return section.data.email ?? 'Coordonnées à définir';
    default:
      return '';
  }
}
