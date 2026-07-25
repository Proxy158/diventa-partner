/* ========================================
   SATURATA PARTNER — Registrazione Attività Commerciali
   ======================================== */

const SUPABASE_URL = 'https://cadgobdxuqioaghstcry.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZGdvYmR4dXFpb2FnaHN0Y3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0OTMwMjgsImV4cCI6MjA5OTA2OTAyOH0.bA1wpasXOBa6l_F50XVw1pv3TN4lcZRmQ56I_mEotEo';

document.addEventListener('DOMContentLoaded', function() {
    initForm();
    initMobileMenu();
    initFaq();
});

function initForm() {
    const form = document.getElementById('partnerForm');
    if (!form) return;
    form.addEventListener('submit', handleSubmit);
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const links = document.querySelector('.nav-links');
    if (!btn || !links) return;
    btn.addEventListener('click', () => {
        links.classList.toggle('mobile-open');
    });
}

function initFaq() {
    window.toggleFaq = toggleFaq;
}

function toggleFaq(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
    });
    if (!isActive) {
        item.classList.add('active');
    }
}

function validateForm() {
    const form = document.getElementById('partnerForm');
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            valid = false;
        }
    });

    const email = form.querySelector('input[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#ef4444';
        valid = false;
    }

    const phone = form.querySelector('input[type="tel"]');
    if (phone && phone.value && !/^[\+]?[\d\s\-\(\)]{8,20}$/.test(phone.value.replace(/\s/g, ''))) {
        phone.style.borderColor = '#ef4444';
        valid = false;
    }

    // Validate checkbox group
    const checked = form.querySelectorAll('input[name="servizi"]:checked');
    if (checked.length === 0) {
        form.querySelectorAll('.checkbox-card').forEach(card => {
            card.style.borderColor = '#ef4444';
        });
        valid = false;
    } else {
        form.querySelectorAll('.checkbox-card').forEach(card => {
            card.style.borderColor = '';
        });
    }

    if (!valid) {
        form.style.animation = 'none';
        form.offsetHeight;
        form.style.animation = 'shake 0.5s ease';
    }

    return valid;
}

async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;

    const formData = new FormData(e.target);

    // Collect checkbox values
    const serviziAbilitati = [];
    document.querySelectorAll('input[name="servizi"]:checked').forEach(cb => {
        serviziAbilitati.push(cb.value);
    });

    // Build payload matching DB columns
    const agentData = {
        ragione_sociale: formData.get('ragione_sociale'),
        p_iva: formData.get('p_iva'),
        tipo_attivita: formData.get('tipo_attivita'),
        sito_web: formData.get('sito_web') || null,
        provincia: formData.get('provincia'),
        citta: formData.get('citta'),
        indirizzo_attivita: formData.get('indirizzo_attivita'),
        servizi_abilitati: serviziAbilitati,
        nome: formData.get('nome'),
        cognome: formData.get('cognome'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        note: formData.get('note') || null,
        status: 'in_prova',
        fonte: 'form_accreditamento',
        data_inizio: new Date().toISOString()
    };

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/agenti`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(agentData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        document.getElementById('partnerForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');

        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', { event_category: 'partner', event_label: 'registrazione' });
        }

    } catch (error) {
        console.error('Errore registrazione:', error);
        document.getElementById('errorText').textContent = 
            'Errore di connessione. Riprova tra qualche istante o contattaci a partner@saturata.it';
        document.getElementById('partnerForm').classList.add('hidden');
        document.getElementById('errorMessage').classList.remove('hidden');
    } finally {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function resetForm() {
    const form = document.getElementById('partnerForm');
    form.reset();
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
    });
    document.querySelectorAll('.checkbox-card').forEach(card => {
        card.style.borderColor = '';
    });
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    form.classList.remove('hidden');
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(shakeStyle);

console.log('✅ Saturata Partner — Form pronto');
