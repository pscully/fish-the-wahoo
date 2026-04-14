interface Stat {
  value: string;
  label: string;
}

const defaultStats: Stat[] = [
  { value: '5,000+', label: 'Happy Clients' },
  { value: '12,000+', label: 'Trophy Catches' },
  { value: '12', label: 'Expert Captains' },
  { value: '30+', label: 'Years in Business' },
];

interface StatsBarProps {
  stats?: Stat[];
}

export default function StatsBar({ stats = defaultStats }: StatsBarProps) {
  return (
    <div className="bg-accent-orange py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
