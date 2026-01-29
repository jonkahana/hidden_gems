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
        default: 'llama_3_w_gems.pdf',
        math: 'llama_3_math_60.pdf',
        coding: 'llama_3_coding_50.pdf',
        routerbench: 'llama_3_total_60.pdf'
    },
    'mistral_7b': {
        default: 'mistral_7b_w_gems.pdf',
        math: 'mistral_7b_math_60.pdf',
        coding: 'mistral_7b_coding_20.pdf',
        routerbench: 'mistral_7b_total_50.pdf'
    },
    'qwen_3b': {
        default: 'qwen_3b_w_gems.pdf',
        math: 'qwen_3b_math_60.pdf',
        coding: 'qwen_3b_coding_45.pdf',
        routerbench: 'qwen_3b_total_65.pdf'
    },
    'qwen_7b': {
        default: 'qwen_7b_w_gems.pdf',
        math: 'qwen_7b_math_60.pdf',
        coding: 'qwen_7b_coding_65.pdf',
        routerbench: 'qwen_7b_total_60.pdf'
    }
};

function switchAtlasView(model, view) {
    const element = document.getElementById(`atlas-${model}`);
    const config = atlasConfig[model];
    
    if (!config || !config[view]) {
        console.error(`No configuration found for model: ${model}, view: ${view}`);
        return;
    }
    
    // Check if it's an img tag (for Llama) or iframe (for others)
    if (element.tagName === 'IMG') {
        // For img tags, use PDF directly without hash parameters
        const pdfPath = `static/images/atlases/${model}/${config[view]}`;
        element.src = pdfPath;
    } else {
        // For iframes, use PDF with hash parameters for viewer
        const pdfPath = `static/images/atlases/${model}/${config[view]}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
        element.src = pdfPath;
    }
    
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
