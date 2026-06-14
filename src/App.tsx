import { useState } from 'react';
import { ClockStage } from './components/ClockStage';
import { SettingsPanel } from './components/SettingsPanel';
import { useClockConfig } from './hooks/useClockConfig';

export default function App() {
  const {
    config, update, updateColors, updateLogo,
    encodeToUrl, pushToHash,
    isSharedView, slugLoading,
    currentSlug, setCurrentSlug,
  } = useClockConfig();

  const [panelOpen, setPanelOpen] = useState(!isSharedView);

  if (slugLoading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: config.colors.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#9a9aa8', fontSize: '1.2rem', fontFamily: 'sans-serif',
      }}>
        불러오는 중…
      </div>
    );
  }

  return (
    <>
      <ClockStage
        config={config}
        panelOpen={panelOpen}
        onOpenPanel={() => setPanelOpen(true)}
      />
      <SettingsPanel
        config={config}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUpdate={update}
        onUpdateColors={updateColors}
        onUpdateLogo={updateLogo}
        encodeToUrl={encodeToUrl}
        pushToHash={pushToHash}
        currentSlug={currentSlug}
        setCurrentSlug={setCurrentSlug}
      />
    </>
  );
}
