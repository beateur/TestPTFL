import { z } from 'zod';

export const heroSectionSchema = z.object({
  id: z.string(),
  type: z.literal('hero'),
  isVisible: z.boolean().default(true),
  data: z.object({
    heading: z.string().min(1, 'Le titre est requis'),
    subheading: z.string().optional(),
    backgroundImage: z.string().url('URL invalide').optional()
  })
});

export const gallerySectionSchema = z.object({
  id: z.string(),
  type: z.literal('gallery'),
  isVisible: z.boolean().default(true),
  data: z.object({
    title: z.string().min(1, 'Le titre est requis'),
    images: z
      .array(
        z.object({
          id: z.string(),
          url: z.string().min(1, 'URL requise'),
          caption: z.string().optional()
        })
      )
      .min(1, 'Ajoutez au moins une image')
  })
});

export const quoteSectionSchema = z.object({
  id: z.string(),
  type: z.literal('quote'),
  isVisible: z.boolean().default(true),
  data: z.object({
    quote: z.string().min(1, 'La citation est requise'),
    author: z.string().optional()
  })
});

export const ctaSectionSchema = z.object({
  id: z.string(),
  type: z.literal('cta'),
  isVisible: z.boolean().default(true),
  data: z.object({
    title: z.string().min(1, 'Le titre est requis'),
    buttonLabel: z.string().min(1, 'Le texte du bouton est requis'),
    buttonHref: z.string().min(1, 'Le lien est requis')
  })
});

export const contactSectionSchema = z.object({
  id: z.string(),
  type: z.literal('contact'),
  isVisible: z.boolean().default(true),
  data: z.object({
    title: z.string().min(1, 'Le titre est requis'),
    instructions: z.string().optional(),
    email: z.string().email('Email invalide').optional()
  })
});

export const pageSectionSchema = z.discriminatedUnion('type', [
  heroSectionSchema,
  gallerySectionSchema,
  quoteSectionSchema,
  ctaSectionSchema,
  contactSectionSchema
]);

export const pageDefinitionSchema = z.object({
  id: z.string(),
  artistId: z.string(),
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  seoDescription: z.string().optional().default(''),
  status: z.enum(['draft', 'published']).default('draft'),
  updatedAt: z.string().optional(),
  publishedAt: z.string().nullish(),
  sections: z.array(pageSectionSchema)
});

export type PageDefinition = z.infer<typeof pageDefinitionSchema>;
export type PageSection = z.infer<typeof pageSectionSchema>;
