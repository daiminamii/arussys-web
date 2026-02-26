// デバイス別サマリーカード
import type { DeviceGroup } from '@/utils/deviceMapping';
import { borderColorByIndex } from '@/utils/deviceMapping';
import { formatDistance, formatTime } from '@/utils/format';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  groups: DeviceGroup[];
}

function DeviceSummaryCard({ group, index }: { group: DeviceGroup; index: number }) {
  const { t } = useLanguage();
  const borderColor = borderColorByIndex(index);

  return (
    <div className={`rounded-lg border-l-4 ${borderColor} bg-gray-800/50 p-4`}>
      <h3 className="mb-2 truncate text-sm font-semibold text-white">{group.deviceName}</h3>
      <p className="font-mono text-2xl text-white">{group.count}</p>
      <p className="text-xs text-gray-400">{t.strava.activities}</p>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">{t.strava.totalDistance}</span>
          <span className="font-mono text-white">{formatDistance(group.totalDistance)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">{t.strava.totalTime}</span>
          <span className="font-mono text-white">{formatTime(group.totalMovingTime)}</span>
        </div>
      </div>
    </div>
  );
}

function DeviceSummary({ groups }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((g, i) => (
        <DeviceSummaryCard key={g.deviceName} group={g} index={i} />
      ))}
    </div>
  );
}

export default DeviceSummary;
