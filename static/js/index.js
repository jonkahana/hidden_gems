window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Atlas view switching functionality
const atlasConfig = {
    'llama3_8b': {
        default: 'llama_3_w_gems.svg',
        math: 'llama_3_math_60.svg',
        coding: 'llama_3_coding_50.svg',
        routerbench: 'llama_3_total_60.svg'
    },
    'mistral_7b': {
        default: 'mistral_7b_w_gems.svg',
        math: 'mistral_7b_math_60.svg',
        coding: 'mistral_7b_coding_20.svg',
        routerbench: 'mistral_7b_total_50.svg'
    },
    'qwen_3b': {
        default: 'qwen_3b_w_gems.svg',
        math: 'qwen_3b_math_60.svg',
        coding: 'qwen_3b_coding_45.svg',
        routerbench: 'qwen_3b_total_65.svg'
    },
    'qwen_7b': {
        default: 'qwen_7b_w_gems.svg',
        math: 'qwen_7b_math_60.svg',
        coding: 'qwen_7b_coding_65.svg',
        routerbench: 'qwen_7b_total_60.svg'
    }
};

function switchAtlasView(model, view) {
    const element = document.getElementById(`atlas-${model}`);
    const config = atlasConfig[model];
    
    if (!config || !config[view]) {
        console.error(`No configuration found for model: ${model}, view: ${view}`);
        return;
    }

    const isImg = element.tagName === 'IMG';
    const newSrc = isImg
        ? `static/images/atlases/${model}/${config[view]}`
        : `static/images/atlases/${model}/${config[view]}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

    // Skip if already showing this view
    if (element.src.endsWith(newSrc) || element.getAttribute('src') === newSrc) {
        return;
    }

    // Create an overlay image for crossfade
    const container = element.closest('.atlas-pdf-container');
    const overlay = document.createElement('img');
    overlay.src = newSrc;
    overlay.alt = element.alt;
    overlay.style.cssText =
        'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity 0.35s ease;z-index:1;';

    container.appendChild(overlay);

    // Once the new image is loaded, crossfade
    overlay.onload = function() {
        // Fade new image in (old image stays visible underneath)
        overlay.style.opacity = '1';

        // After the transition, swap the real src and remove the overlay
        overlay.addEventListener('transitionend', function handler() {
            overlay.removeEventListener('transitionend', handler);
            element.src = newSrc;
            overlay.remove();
        });
    };
    
    // Update active button state
    const panel = element.closest('.atlas-panel');
    const buttons = panel.querySelectorAll('.atlas-btn');
    buttons.forEach(btn => {
        if (btn.dataset.model === model && btn.dataset.view === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize active state for default buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    const defaultButtons = document.querySelectorAll('.atlas-btn[data-view="default"]');
    defaultButtons.forEach(btn => {
        btn.classList.add('active');
    });
});

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})
