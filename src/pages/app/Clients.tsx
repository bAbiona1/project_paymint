import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, Mail, Phone, Eye, Pencil, Trash2, Users, Upload, X } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { getInitials } from '../../lib/utils';
import type { Client } from '../../lib/supabase';
import { toast } from 'sonner';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  notes: string;
}

const emptyForm: ClientFormData = {
  name: '', email: '', phone: '', company: '',
  address: '', city: '', country: '', notes: '',
};

function ClientForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: ClientFormData;
  onSubmit: (d: ClientFormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  let initialLogo = '';
  let initialNotes = initial?.notes || '';
  if (initialNotes.startsWith('LOGO_DATA:')) {
    const parts = initialNotes.split('|||');
    initialLogo = parts[0].replace('LOGO_DATA:', '');
    initialNotes = parts[1] || '';
  }

  const [form, setForm] = useState<ClientFormData>({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    company: initial?.company || '',
    address: initial?.address || '',
    city: initial?.city || '',
    country: initial?.country || '',
    notes: initialNotes,
  });

  const [logo, setLogo] = useState<string>(initialLogo);
  const [errors, setErrors] = useState<Partial<ClientFormData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(k: keyof ClientFormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image size must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogo('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    const notesWithLogo = logo ? `LOGO_DATA:${logo}|||${form.notes}` : form.notes;
    onSubmit({ ...form, notes: notesWithLogo });
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Logo upload block */}
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-[var(--paymint-surface-border)] rounded-xl bg-[var(--paymint-surface-bg)]">
        <label className="text-xs font-semibold text-[var(--paymint-text-secondary)] mb-3">Client Logo / Avatar</label>
        <div className="relative group">
          <div className="w-20 h-20 rounded-full border border-[var(--paymint-surface-border)] bg-white overflow-hidden flex items-center justify-center shadow-sm">
            {logo ? (
              <img src={logo} className="w-full h-full object-cover" alt="Client Logo" />
            ) : (
              <Users className="w-8 h-8 text-[var(--paymint-text-tertiary)]" />
            )}
          </div>
          {logo && (
            <button
              type="button"
              onClick={removeLogo}
              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-[var(--paymint-danger-bg)] text-[var(--paymint-danger-text)] hover:bg-[var(--paymint-surface-subtle)] border border-[var(--paymint-danger-border)] shadow-sm transition-colors"
              title="Remove logo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="mt-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoChange}
            accept="image/*"
            className="hidden"
            id="client-logo-upload"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<Upload className="w-3.5 h-3.5" />}
            onClick={() => fileInputRef.current?.click()}
          >
            {logo ? 'Change Image' : 'Upload Image'}
          </Button>
        </div>
        <p className="text-[10px] text-[var(--paymint-text-tertiary)] mt-1.5">Supports JPG, PNG under 2MB</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          required
          placeholder="Marcus Chen"
        />
        <Input
          label="Company"
          value={form.company}
          onChange={(e) => set('company', e.target.value)}
          placeholder="Acme Corp"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="client@example.com"
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="+1 555 0100"
        />
      </div>
      <Input
        label="Address"
        value={form.address}
        onChange={(e) => set('address', e.target.value)}
        placeholder="123 Main St"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
          placeholder="New York"
        />
        <Input
          label="Country"
          value={form.country}
          onChange={(e) => set('country', e.target.value)}
          placeholder="United States"
        />
      </div>
      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => set('notes', e.target.value)}
        placeholder="Internal notes about this client…"
        className="min-h-[72px]"
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
        <Button onClick={handleSubmit} loading={loading} type="button">
          {initial ? 'Save changes' : 'Add client'}
        </Button>
      </div>
    </div>
  );
}

export default function Clients() {
  const [search, setSearch] = useState('');
  const { clients, loading, createClient, updateClient, deleteClient } = useClients(search);
  const [showAdd, setShowAdd] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  async function handleCreate(data: ClientFormData) {
    setMutating(true);
    const { error } = await createClient(data);
    setMutating(false);
    if (error) toast.error('Failed to add client');
    else {
      toast.success('Client added');
      setShowAdd(false);
    }
  }

  async function handleUpdate(data: ClientFormData) {
    if (!editClient) return;
    setMutating(true);
    const { error } = await updateClient(editClient.id, data);
    setMutating(false);
    if (error) toast.error('Failed to update client');
    else {
      toast.success('Client updated');
      setEditClient(null);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setMutating(true);
    const { error } = await deleteClient(deleteId);
    setMutating(false);
    if (error) toast.error('Failed to delete client');
    else {
      toast.success('Client deleted');
      setDeleteId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">Clients</h1>
          <p className="text-sm text-[var(--paymint-text-tertiary)] mt-0.5">Manage your client relationships.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
          New Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--paymint-text-tertiary)]" />
        <input
          className="h-10 w-full rounded-md border border-[var(--paymint-surface-border)] pl-9 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--paymint-primary-100)] focus:border-[var(--paymint-primary-600)] hover:border-[var(--paymint-primary-300)] transition-colors"
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--paymint-surface-subtle)] flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[var(--paymint-text-tertiary)]" />
            </div>
            <p className="text-base font-semibold text-[var(--paymint-text-primary)] mb-1">
              {search ? 'No clients found' : 'No clients yet'}
            </p>
            <p className="text-sm text-[var(--paymint-text-tertiary)] mb-5 max-w-[240px]">
              {search ? 'Try a different search.' : 'Add your first client to get started.'}
            </p>
            {!search && (
              <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAdd(true)}>
                Add Client
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paymint-surface-bg)] border-b border-[var(--paymint-surface-border)]">
                  <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Client</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden lg:table-cell">Location</th>
                  <th className="px-4 py-2.5 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paymint-surface-divider)]">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[var(--paymint-surface-subtle)] transition-colors duration-[80ms]">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--paymint-primary-100)] overflow-hidden flex items-center justify-center flex-shrink-0">
                          {client.notes?.startsWith('LOGO_DATA:') ? (
                            <img src={client.notes.split('|||')[0].replace('LOGO_DATA:', '')} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <span className="text-xs font-semibold text-[var(--paymint-primary-700)]">
                              {getInitials(client.name)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--paymint-text-primary)]">{client.name}</p>
                          {client.company && (
                            <p className="text-xs text-[var(--paymint-text-tertiary)] flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {client.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="space-y-0.5">
                        {client.email && (
                          <p className="text-sm text-[var(--paymint-text-secondary)] flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> {client.email}
                          </p>
                        )}
                        {client.phone && (
                          <p className="text-sm text-[var(--paymint-text-secondary)] flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-sm text-[var(--paymint-text-secondary)]">
                        {[client.city, client.country].filter(Boolean).join(', ') || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/app/clients/${client.id}`}
                          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-text-primary)] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditClient(client)}
                          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-text-primary)] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(client.id)}
                          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-danger-bg)] hover:text-[var(--paymint-danger-text)] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add new client" size="md">
        <ClientForm onSubmit={handleCreate} onCancel={() => setShowAdd(false)} loading={mutating} />
      </Modal>

      {/* Edit Modal */}
      {editClient && (
        <Modal open={!!editClient} onClose={() => setEditClient(null)} title="Edit client" size="md">
          <ClientForm
            initial={{
              name: editClient.name,
              email: editClient.email || '',
              phone: editClient.phone || '',
              company: editClient.company || '',
              address: editClient.address || '',
              city: editClient.city || '',
              country: editClient.country || '',
              notes: editClient.notes || '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditClient(null)}
            loading={mutating}
          />
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete client"
        subtitle="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} loading={mutating}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-[var(--paymint-text-secondary)] pb-2">
          Are you sure you want to delete this client? Associated invoices will remain but the client will be removed.
        </p>
      </Modal>
    </div>
  );
}
