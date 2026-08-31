"use client";

import { useEffect } from "react";
import {
  CmsLivePlacementsProvider,
  useCmsLivePagePlacements,
} from "@/context/CmsLivePlacementsContext";
import CmsLiveModeBar from "@/components/cms/pages/live/CmsLiveModeBar";
import CmsLivePlacementStack from "@/components/cms/pages/live/CmsLivePlacementStack";
import CmsLiveFieldEditDrawer from "@/components/cms/pages/live/CmsLiveFieldEditDrawer";

function CmsLivePageSectionsView() {
  const { loading } = useCmsLivePagePlacements();

  useEffect(() => {
    const prev = document.body.style.paddingTop;
    document.body.style.paddingTop = "57px";
    return () => {
      document.body.style.paddingTop = prev;
    };
  }, []);

  return (
    <div>
      <CmsLiveModeBar />
      {loading ? (
        <div className="px-4 py-16 text-center text-sm text-slate-500">
          Loading sections…
            </div>
      ) : (
        <CmsLivePlacementStack />
      )}
      <CmsLiveFieldEditDrawer />
            </div>
  );
}

/** Live section editor — identity from CmsLiveEditProvider, placements from CmsLivePlacementsProvider. */
export default function CmsLivePageSections() {
            return (
    <CmsLivePlacementsProvider>
      <CmsLivePageSectionsView />
    </CmsLivePlacementsProvider>
  );
}
