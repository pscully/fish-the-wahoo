import { useEffect, useState } from 'react';
import { Plus, Pencil, X, Loader2, Ship, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Captain, BoatClass, BoatWithRelations } from '../../lib/types';

const LABEL = 'block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5';
const FIELD = 'input-field text-sm';

export default function AdminCaptains() {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [boats, setBoats] = useState<BoatWithRelations[]>([]);
  const [boatClasses, setBoatClasses] = useState<BoatClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'captains' | 'boats'>('captains');

  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [editCaptain, setEditCaptain] = useState<Captain | null>(null);
  const [captainForm, setCaptainForm] = useState({ name: '', email: '', phone: '', bio: '' });
  const [savingCaptain, setSavingCaptain] = useState(false);

  const [showBoatModal, setShowBoatModal] = useState(false);
  const [editBoat, setEditBoat] = useState<BoatWithRelations | null>(null);
  const [boatForm, setBoatForm] = useState({
    name: '',
    captain_id: '',
    boat_class_id: '',
    description: '',
  });
  const [savingBoat, setSavingBoat] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [cRes, bRes, bcRes] = await Promise.all([
      supabase.from('captains').select('*').order('name'),
      supabase.from('boats').select('*, captains(*), boat_classes(*)').order('name'),
      supabase.from('boat_classes').select('*').order('display_order'),
    ]);
    if (cRes.data) setCaptains(cRes.data as Captain[]);
    if (bRes.data) setBoats(bRes.data as BoatWithRelations[]);
    if (bcRes.data) setBoatClasses(bcRes.data as BoatClass[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCaptainModal = (captain?: Captain) => {
    if (captain) {
      setEditCaptain(captain);
      setCaptainForm({
        name: captain.name,
        email: captain.email,
        phone: captain.phone,
        bio: captain.bio,
      });
    } else {
      setEditCaptain(null);
      setCaptainForm({ name: '', email: '', phone: '', bio: '' });
    }
    setShowCaptainModal(true);
  };

  const saveCaptain = async () => {
    if (!captainForm.name) return;
    setSavingCaptain(true);
    if (editCaptain) {
      await supabase.from('captains').update(captainForm).eq('id', editCaptain.id);
    } else {
      await supabase.from('captains').insert(captainForm);
    }
    setSavingCaptain(false);
    setShowCaptainModal(false);
    loadData();
  };

  const toggleCaptainActive = async (captain: Captain) => {
    await supabase
      .from('captains')
      .update({ is_active: !captain.is_active })
      .eq('id', captain.id);
    loadData();
  };

  const openBoatModal = (boat?: BoatWithRelations) => {
    if (boat) {
      setEditBoat(boat);
      setBoatForm({
        name: boat.name,
        captain_id: boat.captain_id || '',
        boat_class_id: boat.boat_class_id,
        description: boat.description,
      });
    } else {
      setEditBoat(null);
      setBoatForm({
        name: '',
        captain_id: '',
        boat_class_id: boatClasses[0]?.id || '',
        description: '',
      });
    }
    setShowBoatModal(true);
  };

  const saveBoat = async () => {
    if (!boatForm.name || !boatForm.boat_class_id) return;
    setSavingBoat(true);
    const data = { ...boatForm, captain_id: boatForm.captain_id || null };
    if (editBoat) {
      await supabase.from('boats').update(data).eq('id', editBoat.id);
    } else {
      await supabase.from('boats').insert(data);
    }
    setSavingBoat(false);
    setShowBoatModal(false);
    loadData();
  };

  const toggleBoatActive = async (boat: BoatWithRelations) => {
    await supabase.from('boats').update({ is_active: !boat.is_active }).eq('id', boat.id);
    loadData();
  };

  const tabBtn = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 ${
      active
        ? 'bg-accent-orange text-white'
        : 'bg-nautical-light text-slate-400 hover:text-white'
    }`;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setTab('captains')} className={tabBtn(tab === 'captains')}>
          <User className="w-4 h-4" /> Captains
        </button>
        <button onClick={() => setTab('boats')} className={tabBtn(tab === 'boats')}>
          <Ship className="w-4 h-4" /> Boats
        </button>
      </div>

      {tab === 'captains' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white uppercase">
              Captains ({captains.length})
            </h2>
            <button onClick={() => openCaptainModal()} className="btn-primary text-sm py-2">
              <Plus className="w-4 h-4 mr-1.5" /> Add Captain
            </button>
          </div>
          <div className="bg-nautical-blue rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Name', 'Email', 'Phone', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : captains.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                      No captains added yet
                    </td>
                  </tr>
                ) : (
                  captains.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-bold text-white">{c.name}</td>
                      <td className="px-5 py-3 text-sm text-slate-400">{c.email}</td>
                      <td className="px-5 py-3 text-sm text-slate-400">{c.phone}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleCaptainActive(c)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                            c.is_active
                              ? 'bg-green-900/40 text-green-400'
                              : 'bg-red-900/40 text-red-400'
                          }`}
                        >
                          {c.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => openCaptainModal(c)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'boats' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white uppercase">
              Boats ({boats.length})
            </h2>
            <button onClick={() => openBoatModal()} className="btn-primary text-sm py-2">
              <Plus className="w-4 h-4 mr-1.5" /> Add Boat
            </button>
          </div>
          <div className="bg-nautical-blue rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Name', 'Class', 'Captain', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : boats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                      No boats added yet
                    </td>
                  </tr>
                ) : (
                  boats.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-bold text-white">{b.name}</td>
                      <td className="px-5 py-3 text-sm text-slate-400">
                        {b.boat_classes?.name}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400">
                        {b.captains?.name || (
                          <span className="text-slate-600">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleBoatActive(b)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                            b.is_active
                              ? 'bg-green-900/40 text-green-400'
                              : 'bg-red-900/40 text-red-400'
                          }`}
                        >
                          {b.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => openBoatModal(b)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Captain Modal */}
      {showCaptainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCaptainModal(false)}
          />
          <div className="relative bg-nautical-blue rounded-xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white uppercase">
                {editCaptain ? 'Edit Captain' : 'Add Captain'}
              </h3>
              <button
                onClick={() => setShowCaptainModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={LABEL}>Name</label>
                <input
                  value={captainForm.name}
                  onChange={(e) => setCaptainForm({ ...captainForm, name: e.target.value })}
                  className={FIELD}
                  placeholder="Captain name"
                />
              </div>
              <div>
                <label className={LABEL}>Email</label>
                <input
                  value={captainForm.email}
                  onChange={(e) => setCaptainForm({ ...captainForm, email: e.target.value })}
                  className={FIELD}
                  placeholder="captain@email.com"
                />
              </div>
              <div>
                <label className={LABEL}>Phone</label>
                <input
                  value={captainForm.phone}
                  onChange={(e) => setCaptainForm({ ...captainForm, phone: e.target.value })}
                  className={FIELD}
                  placeholder="(843) 555-0123"
                />
              </div>
              <div>
                <label className={LABEL}>Bio</label>
                <textarea
                  value={captainForm.bio}
                  onChange={(e) => setCaptainForm({ ...captainForm, bio: e.target.value })}
                  className={`${FIELD} min-h-[80px] resize-y`}
                  placeholder="Brief bio..."
                />
              </div>
              <button
                onClick={saveCaptain}
                disabled={savingCaptain || !captainForm.name}
                className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
              >
                {savingCaptain ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editCaptain ? (
                  'Update Captain'
                ) : (
                  'Add Captain'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boat Modal */}
      {showBoatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowBoatModal(false)}
          />
          <div className="relative bg-nautical-blue rounded-xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white uppercase">
                {editBoat ? 'Edit Boat' : 'Add Boat'}
              </h3>
              <button
                onClick={() => setShowBoatModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={LABEL}>Boat Name</label>
                <input
                  value={boatForm.name}
                  onChange={(e) => setBoatForm({ ...boatForm, name: e.target.value })}
                  className={FIELD}
                  placeholder="Boat name"
                />
              </div>
              <div>
                <label className={LABEL}>Class</label>
                <select
                  value={boatForm.boat_class_id}
                  onChange={(e) => setBoatForm({ ...boatForm, boat_class_id: e.target.value })}
                  className={FIELD}
                >
                  <option value="">Select class</option>
                  {boatClasses.map((bc) => (
                    <option key={bc.id} value={bc.id}>
                      {bc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Captain</label>
                <select
                  value={boatForm.captain_id}
                  onChange={(e) => setBoatForm({ ...boatForm, captain_id: e.target.value })}
                  className={FIELD}
                >
                  <option value="">Unassigned</option>
                  {captains
                    .filter((c) => c.is_active)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea
                  value={boatForm.description}
                  onChange={(e) => setBoatForm({ ...boatForm, description: e.target.value })}
                  className={`${FIELD} min-h-[80px] resize-y`}
                  placeholder="Boat description..."
                />
              </div>
              <button
                onClick={saveBoat}
                disabled={savingBoat || !boatForm.name || !boatForm.boat_class_id}
                className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
              >
                {savingBoat ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editBoat ? (
                  'Update Boat'
                ) : (
                  'Add Boat'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
