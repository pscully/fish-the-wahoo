import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Check, X as XIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Captain, Boat, CaptainAvailability } from '../../lib/types';

const SLOTS = [
  { key: 'am', label: 'AM (Half Day)' },
  { key: 'pm', label: 'PM (Half Day)' },
  { key: 'three_quarter', label: '3/4 Day' },
  { key: 'full_day', label: 'Full Day' },
] as const;

export default function AdminAvailability() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [availability, setAvailability] = useState<CaptainAvailability[]>([]);
  const [selectedCaptain, setSelectedCaptain] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [cRes, bRes] = await Promise.all([
      supabase.from('captains').select('*').eq('is_active', true).order('name'),
      supabase.from('boats').select('*').eq('is_active', true).order('name'),
    ]);
    if (cRes.data) {
      setCaptains(cRes.data as Captain[]);
      if (!selectedCaptain && cRes.data.length > 0) {
        setSelectedCaptain(cRes.data[0].id);
      }
    }
    if (bRes.data) setBoats(bRes.data as Boat[]);
    setLoading(false);
  };

  const loadAvailability = async () => {
    if (!selectedCaptain) return;
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

    const { data } = await supabase
      .from('captain_availability')
      .select('*')
      .eq('captain_id', selectedCaptain)
      .gte('date', start)
      .lte('date', end);

    if (data) setAvailability(data as CaptainAvailability[]);
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadAvailability(); }, [selectedCaptain, currentMonth]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOffset = getDay(startOfMonth(currentMonth));

  const getDateAvailability = (dateStr: string) => {
    return availability.filter((a) => a.date === dateStr);
  };

  const toggleSlot = async (dateStr: string, slot: string) => {
    setSaving(true);
    const existing = availability.find(
      (a) => a.date === dateStr && a.slot === slot && a.captain_id === selectedCaptain
    );

    const captainBoats = boats.filter((b) => b.captain_id === selectedCaptain);
    const boatId = captainBoats.length > 0 ? captainBoats[0].id : boats[0]?.id;

    if (!boatId) {
      setSaving(false);
      return;
    }

    if (existing) {
      await supabase.from('captain_availability').delete().eq('id', existing.id);
    } else {
      await supabase.from('captain_availability').insert({
        captain_id: selectedCaptain,
        boat_id: boatId,
        date: dateStr,
        slot,
        is_available: true,
      });
    }

    await loadAvailability();
    setSaving(false);
  };

  const setAllSlots = async (dateStr: string, available: boolean) => {
    setSaving(true);
    const captainBoats = boats.filter((b) => b.captain_id === selectedCaptain);
    const boatId = captainBoats.length > 0 ? captainBoats[0].id : boats[0]?.id;
    if (!boatId) { setSaving(false); return; }

    if (available) {
      for (const slot of SLOTS) {
        const exists = availability.find((a) => a.date === dateStr && a.slot === slot.key);
        if (!exists) {
          await supabase.from('captain_availability').insert({
            captain_id: selectedCaptain,
            boat_id: boatId,
            date: dateStr,
            slot: slot.key,
            is_available: true,
          });
        }
      }
    } else {
      const toDelete = availability.filter((a) => a.date === dateStr);
      for (const item of toDelete) {
        await supabase.from('captain_availability').delete().eq('id', item.id);
      }
    }

    await loadAvailability();
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-navy-400 font-body">Loading...</div>;
  }

  if (captains.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-navy-400 font-body">Add captains first before managing availability.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div>
          <label className="block text-xs font-body font-medium text-navy-500 mb-1">Captain</label>
          <select
            value={selectedCaptain}
            onChange={(e) => setSelectedCaptain(e.target.value)}
            className="input-field text-sm min-w-[200px]"
          >
            {captains.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 sm:ml-auto">
          {saving && <Loader2 className="w-4 h-4 text-sea-600 animate-spin" />}
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-navy-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-navy-600" />
          </button>
          <span className="font-display text-lg text-navy-900 min-w-[180px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-navy-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-navy-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-navy-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="px-2 py-3 text-center text-xs font-body font-semibold text-navy-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="border-b border-r border-navy-100 min-h-[80px] bg-navy-50/50" />
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayAvail = getDateAvailability(dateStr);
            const slotCount = dayAvail.length;
            const isSelected = selectedDate === dateStr;
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div
                key={dateStr}
                onClick={() => !isPast && setSelectedDate(isSelected ? null : dateStr)}
                className={`border-b border-r border-navy-100 min-h-[80px] p-2 cursor-pointer transition-colors ${
                  isPast ? 'bg-navy-50/50 opacity-50 cursor-default' : isSelected ? 'bg-sea-50' : 'hover:bg-navy-50'
                }`}
              >
                <span className={`text-sm font-body ${slotCount > 0 ? 'font-semibold text-navy-900' : 'text-navy-400'}`}>
                  {format(day, 'd')}
                </span>
                {slotCount > 0 && (
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayAvail.map((a) => (
                      <span key={a.id} className="w-2 h-2 rounded-full bg-sea-500" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 bg-white rounded-xl border border-navy-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-navy-900">
              {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setAllSlots(selectedDate, true)}
                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-body text-xs font-medium hover:bg-green-100 transition-colors"
              >
                <Check className="w-3 h-3 inline mr-1" /> All Available
              </button>
              <button
                onClick={() => setAllSlots(selectedDate, false)}
                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-body text-xs font-medium hover:bg-red-100 transition-colors"
              >
                <XIcon className="w-3 h-3 inline mr-1" /> Clear All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SLOTS.map((slot) => {
              const isAvail = availability.some(
                (a) => a.date === selectedDate && a.slot === slot.key
              );
              return (
                <button
                  key={slot.key}
                  onClick={() => toggleSlot(selectedDate, slot.key)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isAvail
                      ? 'border-sea-500 bg-sea-50 text-sea-700'
                      : 'border-navy-200 bg-white text-navy-400 hover:border-navy-300'
                  }`}
                >
                  <p className="font-body text-sm font-semibold">{slot.label}</p>
                  <p className="font-body text-xs mt-1">
                    {isAvail ? 'Available' : 'Unavailable'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs font-body text-navy-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sea-500" /> Available slot
        </span>
        <span>Click a date to manage time slots</span>
      </div>
    </div>
  );
}
