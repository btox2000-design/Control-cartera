import { supabase } from '../supabaseClient.js';

const getUserId = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) throw new Error('Usuario no autenticado');
    return session.user.id;
};

const handleResponse = (data, error) => {
    if (error) throw error;
    return data;
};

export const Storage = {
    // === LECTURAS ===
    getCredits: async () => {
        const userId = await getUserId();
        const { data, error } = await supabase.from('credits').select('*').eq('user_id', userId);
        return handleResponse(data, error) || [];
    },
    getTransactions: async () => {
        const userId = await getUserId();
        const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId);
        return handleResponse(data, error) || [];
    },
    getClients: async () => {
        const userId = await getUserId();
        const { data, error } = await supabase.from('clients').select('*').eq('user_id', userId);
        return handleResponse(data, error) || [];
    },

    // === ESCRITURA ===
    addClient: async (name) => {
        const userId = await getUserId();
        const id = crypto.randomUUID(); // Generación client-side
        const { data, error } = await supabase.from('clients').insert([{ id, name, user_id: userId }]).select();
        return handleResponse(data, error)[0];
    },
    deleteClient: async (id) => {
        const userId = await getUserId();
        const { error } = await supabase.from('clients').delete().eq('id', id).eq('user_id', userId);
        handleResponse(null, error);
        return true;
    },
    addCredit: async (credit) => {
        const userId = await getUserId();
        const id = crypto.randomUUID(); // Generación client-side
        const cleanCredit = { ...credit, id, user_id: userId }; 
        const { data, error } = await supabase.from('credits').insert([cleanCredit]).select();
        return handleResponse(data, error)[0];
    },
    deleteCredit: async (id) => {
        const userId = await getUserId();
        const { error } = await supabase.from('credits').delete().eq('id', id).eq('user_id', userId);
        handleResponse(null, error);
        return true;
    },
    updateCreditPaidMonths: async (id, paidMonths) => {
        const userId = await getUserId();
        const { data, error } = await supabase.from('credits').update({ paidMonths }).eq('id', id).eq('user_id', userId).select();
        return handleResponse(data, error)[0];
    },
    updateCreditDate: async (id, createdAt) => {
        const userId = await getUserId();
        const { data, error } = await supabase.from('credits').update({ createdAt }).eq('id', id).eq('user_id', userId).select();
        return handleResponse(data, error)[0];
    },
    updateCreditRate: async (id, annualRate) => {
        const userId = await getUserId();
        const { data, error } = await supabase.from('credits').update({ annualRate }).eq('id', id).eq('user_id', userId).select();
        return handleResponse(data, error)[0];
    },
    addTransaction: async (transaction) => {
        const userId = await getUserId();
        const id = crypto.randomUUID(); // Generación client-side
        const cleanTrans = { ...transaction, id, user_id: userId };
        const { data, error } = await supabase.from('transactions').insert([cleanTrans]).select();
        return handleResponse(data, error)[0];
    }
};
