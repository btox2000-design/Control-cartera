// Cliente de Supabase cargado mediante CDN en el HTML
const supabaseUrl = 'https://zihpupmjqrzhzoivnerk.supabase.co';
const supabaseKey = 'sb_publishable_GluME3HZqKkjgI74fAmNVA_oHwI7fZb';

// Cliente lazily inicializado
const getSupabase = () => {
    if (!window.supabase) {
        throw new Error('Supabase SDK not loaded');
    }
    return window.supabase.createClient(supabaseUrl, supabaseKey);
};

export const Storage = {
    // === LECTURAS ===
    getCredits: async () => {
        const { data, error } = await getSupabase().from('credits').select('*');
        if (error) throw error;
        return data || [];
    },
    getTransactions: async () => {
        const { data, error } = await getSupabase().from('transactions').select('*');
        if (error) throw error;
        return data || [];
    },
    getClients: async () => {
        const { data, error } = await getSupabase().from('clients').select('*');
        if (error) throw error;
        return data || [];
    },

    // === CLIENTES ===
    addClient: async (name) => {
        const { data, error } = await getSupabase().from('clients').insert([{ name }]).select();
        if (error) throw error;
        return data[0];
    },
    deleteClient: async (id) => {
        const { error } = await getSupabase().from('clients').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // === CRÉDITOS ===
    addCredit: async (credit) => {
        const cleanCredit = { ...credit };
        if (cleanCredit.id === null || cleanCredit.id === undefined) {
            delete cleanCredit.id;
        }
        const { data, error } = await getSupabase().from('credits').insert([cleanCredit]).select();
        if (error) throw error;
        return data[0];
    },
    deleteCredit: async (id) => {
        // 1. Borramos transacciones asociadas a este crédito
        await getSupabase().from('transactions').delete().eq('creditId', id);
        // 2. Borramos el crédito
        const { error } = await getSupabase().from('credits').delete().eq('id', id);
        if (error) throw error;
        return true;
    },
    updateCreditPaidMonths: async (id, paidMonths) => {
        const { data, error } = await getSupabase().from('credits').update({ paidMonths }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },
    updateCreditRate: async (id, annualRate) => {
        const { data, error } = await getSupabase().from('credits').update({ annualRate }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    // === TRANSACCIONES ===
    addTransaction: async (transaction) => {
        const cleanTrans = { ...transaction };
        if (cleanTrans.id === null || cleanTrans.id === undefined) {
            delete cleanTrans.id;
        }
        const { data, error } = await getSupabase().from('transactions').insert([cleanTrans]).select();
        if (error) throw error;
        return data[0];
    }
};
