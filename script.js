// ====== CONTROLE DO CARROSSEL (SLIDER TOYOCAR) ======
const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let index = 0;

function getVisibleSlidesCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3; // Computador exibe 3 fotos por vez
}

function updateSlider() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
}

function nextSlide() {
    const visibleSlides = getVisibleSlidesCount();
    const maxIndex = slides.length - visibleSlides;
    
    if (index >= maxIndex) {
        index = 0; // Volta para o início
    } else {
        index++;
    }
    updateSlider();
}

function prevSlide() {
    const visibleSlides = getVisibleSlidesCount();
    const maxIndex = slides.length - visibleSlides;
    
    if (index <= 0) {
        index = maxIndex; // Vai para o final
    } else {
        index--;
    }
    updateSlider();
}

// Eventos de clique nos botões direcionais
nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

// Configuração do movimento automático (Passa a foto a cada 4 segundos)
let autoSlideInterval = setInterval(nextSlide, 4000);

function resetTimer() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// Reposiciona o layout caso o usuário mude o tamanho da tela (Ex: girar o celular)
window.addEventListener('resize', () => {
    index = 0; // Reseta o contador para evitar quebra de alinhamento
    updateSlider();
});

// Configurações do Supabase
const SUPABASE_URL = "https://kfuadyvymgdydoptzgbh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdWFkeXZ5bWdkeWRvcHR6Z2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTAxMjMsImV4cCI6MjA5NjY4NjEyM30.oXW9c7wFHcRMamqSaOmQWZgs8Wwtbk8U7j3isTdXrnI";

async function registrarAcesso() {
    try {
        // Coleta o raio-x estatístico completo e anônimo do dispositivo
        const dadosAcesso = {
            p_user_agent: navigator.userAgent,
            p_referrer: document.referrer || "Acesso Direto",
            p_screen_width: window.screen.width,
            p_screen_height: window.screen.height,
            p_language: navigator.language,
            p_client_time: new Date().toLocaleString("pt-BR") // Hora local do dispositivo do cliente
        };

        // Envia de forma silenciosa para o banco via RPC
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(dadosAcesso)
        });
    } catch (error) {
        // Falha silenciosa no console caso o banco fique indisponível
        console.error("Erro ao contabilizar acesso.");
    }
}

// Dispara a função assim que a estrutura da página termina de carregar
document.addEventListener("DOMContentLoaded", registrarAcesso);
