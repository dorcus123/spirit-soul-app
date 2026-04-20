// Spirit & Soul - Main App JavaScript
// With localStorage persistence and Firebase-ready structure

// ==========================================
// MOOD DATA
// ==========================================
const moodMessages = {
    happy: {
        message: "🎉 Savor every second of this happiness, allowing it to spread. You are on a path of positivity and growth—keep moving forward!",
        verse: "📖 <strong>Nehemiah 8:10</strong> — <em>Do not grieve, for the joy of the Lord is your strength.</em>"
    },
    sad: {
        message: "🕊️ Even in sorrow, God draws near. His comfort is wrapping around you even now.",
        verse: "📖 <strong>Psalm 34:18</strong> — <em>The Lord is close to the brokenhearted and saves those who are crushed in spirit.</em>"
    },
    anxious: {
        message: "💚 Take a deep breath—God has not forgotten you. Release your worries into His hands today.",
        verse: "📖 <strong>Philippians 4:6-7</strong> — <em>Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.</em>"
    },
    hopeful: {
        message: "✨ Hope is a divine spark from Heaven. God is preparing something beautiful in the unseen—keep your faith alive!",
        verse: "📖 <strong>Romans 15:13</strong> — <em>May the God of hope fill you with all joy and peace as you trust in Him.</em>"
    },
    confused: {
        message: "🕊️ When you lack direction, quiet your heart—God's whisper will come through peace, not pressure.",
        verse: "📖 <strong>Proverbs 3:5-6</strong> — <em>Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to Him, and He will make your paths straight.</em>"
    },
    calm: {
        message: "🌿 Rest, beloved. The Lord delights when you find peace in His presence.",
        verse: "📖 <strong>Isaiah 26:3</strong> — <em>You will keep in perfect peace those whose minds are steadfast, because they trust in You.</em>"
    },
    overwhelmed: {
        message: "🌊 You don't have to carry this alone. God sees every burden and He's inviting you to cast them upon Him.",
        verse: "📖 <strong>Matthew 11:28</strong> — <em>Come to me, all you who are weary and burdened, and I will give you rest.</em>"
    },
    lonely: {
        message: "💫 You are never alone. Even in the silence, God is with you—closer than your next breath.",
        verse: "📖 <strong>Deuteronomy 31:6</strong> — <em>He will never leave you nor forsake you.</em>"
    },
    angry: {
        message: "🔥 Your feelings are valid, but don't let anger take root. God can transform this into something redemptive.",
        verse: "📖 <strong>Ephesians 4:26-27</strong> — <em>In your anger do not sin: Do not let the sun go down while you are still angry, and do not give the devil a foothold.</em>"
    },
    grateful: {
        message: "🙏 Gratitude opens the door to more blessings. Your thankful heart pleases the Lord.",
        verse: "📖 <strong>1 Thessalonians 5:18</strong> — <em>Give thanks in all circumstances; for this is God's will for you in Christ Jesus.</em>"
    },
    doubtful: {
        message: "🌱 Doubt doesn't disqualify you. Even in your questions, God is working to strengthen your faith.",
        verse: "📖 <strong>Mark 9:24</strong> — <em>Immediately the boy's father exclaimed, 'I do believe; help me overcome my unbelief!'</em>"
    },
    peaceful: {
        message: "🕊️ This peace is a gift from Heaven. Treasure it, for it's a sign of God's presence with you.",
        verse: "📖 <strong>John 14:27</strong> — <em>Peace I leave with you; my peace I give you. I do not give to you as the world gives.</em>"
    },
    broken: {
        message: "💔 God specializes in mending broken hearts. He's collecting every tear and healing every wound.",
        verse: "📖 <strong>Psalm 147:3</strong> — <em>He heals the brokenhearted and binds up their wounds.</em>"
    },
    inspired: {
        message: "⚡ This inspiration is divine. Step forward with confidence—God is empowering you for this season!",
        verse: "📖 <strong>Philippians 4:13</strong> — <em>I can do all things through Christ who strengthens me.</em>"
    },
    waiting: {
        message: "⏳ Waiting is not wasted time. God is preparing you and perfecting His plan. Trust His timing.",
        verse: "📖 <strong>Isaiah 40:31</strong> — <em>But those who hope in the Lord will renew their strength. They will soar on wings like eagles.</em>"
    }
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentMood = "";
let journalEntries = [];

// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================
function saveToLocalStorage() {
    try {
        localStorage.setItem('spiritSoulJournal', JSON.stringify(journalEntries));
        localStorage.setItem('spiritSoulMood', currentMood);
        showSyncStatus('Saved');
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage() {
    try {
        const savedJournal = localStorage.getItem('spiritSoulJournal');
        const savedMood = localStorage.getItem('spiritSoulMood');
        
        if (savedJournal) {
            journalEntries = JSON.parse(savedJournal);
        }
        
        if (savedMood) {
            currentMood = savedMood;
        }
        
        return true;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return false;
    }
}

function showSyncStatus(text) {
    const syncStatus = document.getElementById('sync-status');
    if (syncStatus) {
        syncStatus.textContent = text;
        syncStatus.classList.add('show');
        setTimeout(() => {
            syncStatus.classList.remove('show');
        }, 2000);
    }
}

// Universal notification function for install prompts and alerts
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('app-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'app-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-size: 14px;
            max-width: 90%;
            width: auto;
            text-align: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            white-space: pre-line;
            line-height: 1.5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(notification);
    }
    
    // Set colors based on type
    const colors = {
        success: 'linear-gradient(135deg, #7A9E9F 0%, #6A8E8F 100%)',
        error: 'linear-gradient(135deg, #E57373 0%, #EF5350 100%)',
        info: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
        warning: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Auto-hide after duration
    setTimeout(() => {
        notification.style.opacity = '0';
    }, duration);
}


// ==========================================
// FIREBASE PLACEHOLDER (Ready for integration)
// ==========================================
// Uncomment and configure when ready to add Firebase

/*
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function saveToFirebase(entry) {
    try {
        const docRef = await addDoc(collection(db, "journal_entries"), {
            ...entry,
            userId: auth.currentUser.uid,
            timestamp: new Date()
        });
        showSyncStatus('Synced to cloud');
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

async function loadFromFirebase() {
    try {
        const q = query(collection(db, "journal_entries"), 
                       where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const entries = [];
        querySnapshot.forEach((doc) => {
            entries.push({ id: doc.id, ...doc.data() });
        });
        return entries;
    } catch (e) {
        console.error("Error loading documents: ", e);
        return [];
    }
}
*/

// ==========================================
// DOM ELEMENTS
// ==========================================
const devotionalButton = document.getElementById('devotional-button');
const devotionalDisplay = document.getElementById('devotional-display');
const moodSelect = document.getElementById('mood-select');
const moodSubmit = document.getElementById('mood-submit');
const moodDisplay = document.getElementById('mood-display');
const updateNotification = document.getElementById('update-notification');
const journalTextarea = document.getElementById('journal-entry');
const saveJournalBtn = document.getElementById('save-journal');
const saveStatus = document.getElementById('save-status');
const journalEntriesList = document.getElementById('journal-entries-list');
const entriesHeader = document.getElementById('entries-header');

// ==========================================
// NAVIGATION
// ==========================================
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show selected page
    document.getElementById(page + '-page').classList.add('active');
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// ==========================================
// DEVOTIONAL FUNCTIONS
// ==========================================
function displayDailyDevotional() {
    const selectedMood = moodSelect.value;
    
    if (!selectedMood || selectedMood === "") {
        devotionalDisplay.innerHTML = `
            <p class="error-message">
                Please select a mood to receive a prophetic word.
            </p>
        `;
        return;
    }

    const moodData = moodMessages[selectedMood];
    
    if (moodData) {
        devotionalDisplay.innerHTML = `
            <div class="message">${moodData.message}</div>
            <div class="verse">${moodData.verse}</div>
        `;
    }
}

function updateMood() {
    const selectedMood = moodSelect.value;
    
    if (!selectedMood || selectedMood === "") {
        updateNotification.textContent = "Please select a mood first.";
        updateNotification.style.background = "rgba(255, 100, 100, 0.2)";
        updateNotification.style.color = "#FFB3B3";
        updateNotification.classList.remove('hidden');
        
        setTimeout(() => {
            updateNotification.classList.add('hidden');
        }, 3000);
        return;
    }

    currentMood = selectedMood;
    const moodText = moodSelect.options[moodSelect.selectedIndex].text;
    
    moodDisplay.textContent = `Current mood: ${moodText}`;
    moodDisplay.classList.remove('hidden');
    
    updateNotification.textContent = `✓ Mood updated to: ${moodText}`;
    updateNotification.style.background = "rgba(122, 158, 159, 0.3)";
    updateNotification.style.color = "#B8D4D4";
    updateNotification.classList.remove('hidden');
    
    // Save to localStorage
    saveToLocalStorage();
    
    setTimeout(() => {
        updateNotification.classList.add('hidden');
    }, 3000);
}

// ==========================================
// JOURNAL FUNCTIONS
// ==========================================
function saveJournalEntry() {
    const entryText = journalTextarea.value.trim();
    
    if (!entryText) {
        saveStatus.textContent = "Please write something before saving.";
        saveStatus.style.color = "#FFB3B3";
        return;
    }

    const entry = {
        date: new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }),
        mood: moodSelect.options[moodSelect.selectedIndex].text || "Not specified",
        text: entryText,
        id: Date.now()
    };

    journalEntries.unshift(entry);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Future: Save to Firebase
    // saveToFirebase(entry);
    
    displayJournalEntries();
    
    journalTextarea.value = "";
    saveStatus.textContent = "✓ Journal entry saved!";
    saveStatus.style.color = "#7A9E9F";
    
    setTimeout(() => {
        saveStatus.textContent = "";
    }, 3000);
}

function toggleEntry(entryId) {
    const entryElement = document.getElementById(`entry-${entryId}`);
    const contentElement = entryElement.querySelector('.entry-content');
    const arrowElement = entryElement.querySelector('.entry-arrow');
    
    contentElement.classList.toggle('open');
    arrowElement.classList.toggle('open');
}

function displayJournalEntries() {
    if (journalEntries.length === 0) {
        journalEntriesList.innerHTML = "";
        if (entriesHeader) {
            entriesHeader.classList.add('hidden');
        }
        return;
    }

    if (entriesHeader) {
        entriesHeader.classList.remove('hidden');
    }

    journalEntriesList.innerHTML = '';

    journalEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-card';
        entryDiv.id = `entry-${entry.id}`;
        entryDiv.innerHTML = `
            <div class="entry-header" onclick="toggleEntry(${entry.id})">
                <div class="entry-info">
                    <div class="entry-date">${entry.date}</div>
                    <div class="entry-mood">Mood: ${entry.mood}</div>
                </div>
                <div class="entry-arrow">▶</div>
            </div>
            <div class="entry-content">
                <div class="entry-text">${entry.text}</div>
            </div>
        `;
        journalEntriesList.appendChild(entryDiv);
    });
}

// ==========================================
// EXPORT FUNCTION
// ==========================================
function exportJournal() {
    if (journalEntries.length === 0) {
        alert('No journal entries to export');
        return;
    }

    let exportText = "SPIRIT & SOUL - JOURNAL EXPORT\n";
    exportText += "=" . repeat(50) + "\n\n";

    journalEntries.forEach((entry, index) => {
        exportText += `Entry #${journalEntries.length - index}\n`;
        exportText += `Date: ${entry.date}\n`;
        exportText += `Mood: ${entry.mood}\n`;
        exportText += `\n${entry.text}\n`;
        exportText += "\n" + "-".repeat(50) + "\n\n";
    });

    // Create downloadable file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spirit-soul-journal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showSyncStatus('Journal exported!');
}

// ==========================================
// CONTACT FORM
// ==========================================
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formStatus = document.getElementById('form-status');
    const name = document.getElementById('name').value;
    
    // Future: Send to actual backend/Firebase
    // For now, just show success message
    
    formStatus.innerHTML = `✓ Thank you, ${name}! Your message has been received.`;
    formStatus.style.color = "#7A9E9F";
    
    this.reset();
    
    setTimeout(() => {
        formStatus.innerHTML = '';
    }, 5000);
});

// ==========================================
// OLD PWA CODE REMOVED - Using enhanced version below
// ==========================================


// Check if user previously dismissed
if (localStorage.getItem('installPromptDismissed')) {
    document.getElementById('install-banner')?.classList.remove('show');
}

// ==========================================
// EVENT LISTENERS
// ==========================================
devotionalButton.addEventListener('click', displayDailyDevotional);
moodSubmit.addEventListener('click', updateMood);
saveJournalBtn.addEventListener('click', saveJournalEntry);

moodSelect.addEventListener('change', function() {
    if (this.value) {
        const moodText = this.options[this.selectedIndex].text;
        moodDisplay.textContent = `Selected: ${moodText}`;
        moodDisplay.classList.remove('hidden');
    }
});

// ==========================================
// SERVICE WORKER REGISTRATION (PWA)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// ==========================================
// PWA INSTALL PROMPT - WORKING VERSION
// ==========================================
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-install');

// Listen for the beforeinstallprompt event (Android/Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ Install prompt available');
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Check if user previously dismissed
    if (!localStorage.getItem('installDismissed')) {
        // Show our custom install banner
        if (installBanner) {
            installBanner.style.display = 'flex';
            console.log('📱 Showing install banner');
        }
    }
});

// Handle install button click
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        console.log('🔘 Install button clicked');
        
        if (!deferredPrompt) {
            console.log('⚠️ No install prompt available - showing manual instructions');
            
            // Detect device and show appropriate instructions
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            
            if (isIOS || isSafari) {
                showNotification('📱 To install on iPhone:\n\n1. Tap the Share button (⬆️)\n2. Scroll and tap "Add to Home Screen"\n3. Tap "Add"', 'info', 6000);
            } else {
                showNotification('📱 To install:\n\n1. Tap the menu (⋮)\n2. Tap "Install app"\n\nOr use your browser\'s install option.', 'info', 5000);
            }
            return;
        }
        
        // Hide our banner
        if (installBanner) {
            installBanner.style.display = 'none';
        }
        
        // Show the browser's install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
            showNotification('App installed successfully! Check your home screen. 🎉', 'success', 4000);
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt
        deferredPrompt = null;
    });
}

// Handle dismiss button click
if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
        console.log('✖️ Dismiss button clicked');
        if (installBanner) {
            installBanner.style.display = 'none';
        }
        // Remember that user dismissed it (for 7 days)
        const dismissTime = new Date().getTime();
        localStorage.setItem('installDismissed', dismissTime.toString());
    });
}

// Check if dismiss is expired (after 7 days, show banner again)
const dismissTime = localStorage.getItem('installDismissed');
if (dismissTime) {
    const now = new Date().getTime();
    const daysSinceDismiss = (now - parseInt(dismissTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismiss > 7) {
        localStorage.removeItem('installDismissed');
    }
}

// Detect if app is already installed
window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA was installed successfully!');
    // Hide the install banner
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    showNotification('App installed! You can now use it from your home screen. 📱✨', 'success', 5000);
    // Remember it's installed
    localStorage.setItem('appInstalled', 'true');
});

// Check if running in standalone mode (already installed)
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('📱 App is running in standalone mode (installed)');
    // Hide install banner if app is already installed
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    localStorage.setItem('appInstalled', 'true');
}

// Also check localStorage for install status
if (localStorage.getItem('appInstalled') === 'true') {
    if (installBanner) {
        installBanner.style.display = 'none';
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadFromLocalStorage();
    
    // Display journal entries
    displayJournalEntries();
    
    // Restore mood selection
    if (currentMood) {
        const option = Array.from(moodSelect.options).find(opt => opt.value === currentMood);
        if (option) {
            moodSelect.value = currentMood;
            const moodText = option.text;
            moodDisplay.textContent = `Current mood: ${moodText}`;
            moodDisplay.classList.remove('hidden');
        }
    }
    
    console.log('Spirit & Soul app initialized');
    console.log(`Loaded ${journalEntries.length} journal entries`);
});

// ==========================================
// PREVENT ZOOM ON DOUBLE TAP (iOS)
// ==========================================
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Make functions globally available
window.navigateTo = navigateTo;
window.toggleEntry = toggleEntry;
window.exportJournal = exportJournal;

// ==========================================
// DONATION SYSTEM
// ==========================================

let selectedDonationAmount = 10; // Default $10
let donationType = 'onetime'; // 'onetime' or 'monthly'

function selectDonation(amount) {
    selectedDonationAmount = amount;
    
    // Clear custom input
    const customInput = document.getElementById('custom-amount');
    if (customInput) {
        customInput.value = '';
    }
    
    // Update button states
    document.querySelectorAll('.donation-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.amount) === amount) {
            btn.classList.add('active');
        }
    });
    
    updateDonationSummary();
}

function selectCustomDonation(amount) {
    if (amount && amount > 0) {
        selectedDonationAmount = parseFloat(amount);
        
        // Clear preset buttons
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        updateDonationSummary();
    }
}

function selectDonationType(type) {
    donationType = type;
    
    // Update button states
    document.querySelectorAll('.donation-type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    updateDonationSummary();
}

function updateDonationSummary() {
    const amountEl = document.getElementById('selected-amount');
    const frequencyEl = document.getElementById('donation-frequency');
    
    if (amountEl) {
        amountEl.textContent = `$${selectedDonationAmount}`;
    }
    
    if (frequencyEl) {
        frequencyEl.textContent = donationType === 'monthly' ? 'per month' : 'once';
    }
}

function donateWithPayPal() {
    // ⚠️ IMPORTANT: UPDATE THIS WITH YOUR PAYPAL USERNAME!
    // Go to: https://www.paypal.com/paypalme/
    // Create your link and replace 'YOURPAYPALUSERNAME' below
    
    const paypalUsername = 'YOURPAYPALUSERNAME'; // ⚠️ CHANGE THIS!
    const amount = selectedDonationAmount;
    
    // Check if PayPal username has been updated
    if (paypalUsername === 'YOURPAYPALUSERNAME') {
        showNotification('⚠️ Please update PayPal username in app.js first!', 'warning', 5000);
        console.error('PayPal username not configured. Update the paypalUsername variable in app.js');
        return;
    }
    
    // PayPal.me link format
    const paypalURL = `https://www.paypal.com/paypalme/${paypalUsername}/${amount}USD`;
    
    // Open PayPal in new tab
    window.open(paypalURL, '_blank');
    
    // Show thank you message
    showNotification(`🙏 Thank you! Redirecting to PayPal for your $${amount} donation...`, 'success', 4000);
    
    // Track donation attempt
    console.log(`Donation attempt: $${amount} ${donationType}`);
}

function donateWithStripe() {
    // This requires Stripe setup (coming in Phase 3)
    // For now, show message
    showNotification('💳 Stripe payment coming soon! Please use PayPal for now.', 'info', 4000);
    
    // TODO: Implement Stripe Checkout in Phase 3
    console.log('Stripe donation clicked - not yet implemented');
}

// Make donation functions globally available
window.selectDonation = selectDonation;
window.selectCustomDonation = selectCustomDonation;
window.selectDonationType = selectDonationType;
window.donateWithPayPal = donateWithPayPal;
window.donateWithStripe = donateWithStripe;