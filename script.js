// ---- NAV COMPACT ON SCROLL ----
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('compact', window.scrollY > 60);
}, { passive: true });

// ---- MOBILE MENU ----
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('open');
    document.getElementById('menuToggle').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('navMenu').classList.remove('open');
    document.getElementById('menuToggle').classList.remove('open');
}

// ---- REVEAL ON SCROLL ----
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.style.transitionDelay = (e.target.dataset.delay || 0) + 'ms';
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---- LOAD MENU FROM API ----
async function loadMenu() {
    try {
        const res = await fetch('/api/cardapio');
        const items = await res.json();

        renderHamburgueres(items.filter(i => i.categoria === 'Hamburgueres'));
        renderNovidades(items.filter(i => i.categoria === 'Novidades'));
        renderPasteis(items.filter(i => i.categoria === 'Pasteis'));

        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    } catch (err) {
        console.error('Erro ao carregar cardápio:', err);
        // Fallback sample data com seus produtos e preços reais
        renderHamburgueres([
            { nome: 'X-TUDO', descricao: 'O MAIS COMPLETO! Hambúrguer artesanal, mussarela, alface, tomate, bacon, ovo, calabresa e presunto.', preco: 20 },
            { nome: 'X-BACON', descricao: 'Alface, tomate, hambúrguer artesanal, fatias de bacon crocante e mussarela.', preco: 17 },
            { nome: 'X-EGG', descricao: 'Hambúrguer artesanal, ovo mal passado, fatias de bacon crocante e mussarela.', preco: 17 },
            { nome: 'X-SALADA', descricao: 'Alface, tomate, hambúrguer artesanal e maionese especial.', preco: 15 },
            { nome: 'X-BURGUER', descricao: 'Hambúrguer artesanal, mussarela e maionese especial.', preco: 12 },
        ]);
        renderNovidades([
            { nome: 'DUPLO CHEDDAR BACON', descricao: '2 hambúrgueres, bacon, mussarela, queijo prato, cheddar e maionese caseira.', preco: 25 },
            { nome: 'CATUPIRY ESPECIAL', descricao: 'Catupiry empanado, hambúrguer caseiro, maionese caseira, mussarela e queijo prato.', preco: 25 },
            { nome: 'MISTO QUENTE', descricao: 'Presunto e mussarela.', preco: 7 },
        ]);
        renderPasteis([
            { nome: 'Frango com catupiry' }, { nome: 'Pizza' }, { nome: 'Carne' },
            { nome: 'Carne com queijo' }, { nome: 'Calabresa com queijo' }, { nome: 'Mussarela' }, { nome: 'Bacon e queijo' }
        ]);
    }
}

const fallbackImgs = [
    'https://images.unsplash.com/photo-1553979459-d2207cc93730?w=800&q=80',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80'
];

function renderHamburgueres(items) {
    const grid = document.getElementById('hamburgueresGrid');
    grid.innerHTML = items.map((item, idx) => `
        <div class="menu-item reveal" data-delay="${idx * 60}">
            <span class="item-num">${String(idx + 1).padStart(2, '0')}</span>
            <div class="item-body">
                <h3>${item.nome}</h3>
                <p>${item.descricao || ''}</p>
            </div>
            <span class="item-price">R$&nbsp;${item.preco.toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');
    grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function renderNovidades(items) {
    const grid = document.getElementById('novidadesGrid');
    grid.innerHTML = items.map((item, idx) => `
        <div class="nov-card">
            <img src="${item.imagem || fallbackImgs[idx % fallbackImgs.length]}" alt="${item.nome}" loading="lazy">
            <div class="nov-overlay">
                <span class="nov-badge">Novidade</span>
                <h3>${item.nome}</h3>
                <p>${item.descricao || ''}</p>
                <span class="nov-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
    `).join('');
}

function renderPasteis(items) {
    const grid = document.getElementById('pasteisGrid');
    grid.innerHTML = items.map((item) => `
        <li>${item.nome}</li>
    `).join('');
}

// Inicializa a função de carregar o menu ao abrir a página
loadMenu();