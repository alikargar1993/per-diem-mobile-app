import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCategories } from '@/features/categories/store/categoriesSlice';
import { loadLocations } from '@/features/locations/store/locationsSlice';
import { loadMenu } from '@/features/menu/store/menuSlice';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import type { AppDispatch, RootState } from '@/shared/store';

/** Refreshes catalog data when connectivity is restored. */
export function NetworkReconnect() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOffline } = useNetworkStatus();
  const selectedLocationId = useSelector(
    (state: RootState) => state.locations.selectedLocationId,
  );
  const wasOfflineRef = useRef(isOffline);

  useEffect(() => {
    const cameOnline = wasOfflineRef.current && !isOffline;
    wasOfflineRef.current = isOffline;

    if (cameOnline) {
      dispatch(loadLocations());
      dispatch(loadCategories());
      if (selectedLocationId) {
        dispatch(loadMenu(selectedLocationId));
      }
    }
  }, [dispatch, isOffline, selectedLocationId]);

  return null;
}
