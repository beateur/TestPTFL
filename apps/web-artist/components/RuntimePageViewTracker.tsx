'use client';

import { useEffect } from 'react';
import { emitRuntimeEvent } from '../lib/analytics';

interface RuntimePageViewTrackerProps {
  artistId: string;
  pageId: string;
  slug: string[];
}

export function RuntimePageViewTracker({ artistId, pageId, slug }: RuntimePageViewTrackerProps) {
  useEffect(() => {
    emitRuntimeEvent('runtime.page_view', {
      artistId,
      pageId,
      slug: slug.join('/')
    });
  }, [artistId, pageId, slug.join('/')]);

  return null;
}
