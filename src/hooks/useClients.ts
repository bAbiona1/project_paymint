import { useState, useEffect, useCallback } from 'react';
import { supabase, type Client } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useClients(search?: string) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) setError(error.message);
    else setClients(data || []);
    setLoading(false);
  }, [user, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients', filter: `user_id=eq.${user.id}` }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetch]);

  async function createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_archived'>) {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('clients').insert({ ...data, user_id: user.id });
    if (!error) await fetch();
    return { error: error?.message || null };
  }

  async function updateClient(id: string, data: Partial<Client>) {
    const { error } = await supabase.from('clients').update(data).eq('id', id);
    if (!error) await fetch();
    return { error: error?.message || null };
  }

  async function deleteClient(id: string) {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (!error) await fetch();
    return { error: error?.message || null };
  }

  return { clients, loading, error, refetch: fetch, createClient, updateClient, deleteClient };
}

export function useClient(id: string | undefined) {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
    setClient(data);
    setLoading(false);
  }, [user, id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { client, loading, refetch: fetch };
}
