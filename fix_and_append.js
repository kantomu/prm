const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'plugins_db.js');
let content = fs.readFileSync(dbPath, 'utf8');

// 1. Fix corrupted lines (Tracktion F.'em)
// We look for lines containing "F." and "Tracktion" and replace them with a clean entry
const cleanEntry = `    { n: 'F.em', m: 'Tracktion', c: 'インストゥルメント', a: '独自認証', u: 'https://www.tracktion.com/', dl: '' },`;

// Replace the line with the weird encoding
content = content.replace(/.*Tracktion.*F\..*/g, cleanEntry);
// Replace the line with the syntax error if it exists differently
content = content.replace(/.*F\.'em.*/g, cleanEntry);

// 2. Remove the last closing bracket to append more
content = content.replace(/\n\];\s*$/, '');

// 3. Append Final Batch (Tier 8 & 9 - Niche, Free, Legacy, etc. to reach 2000+)
const finalBatch = `
    // ========================================
    // TIER 8: MORE ESSENTIALS & NICHE (1700-1900)
    // ========================================
    // --- AIR Music Tech (expanded) ---
    { n: 'Xpand!2', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/xpand-2.html', dl: '' },
    { n: 'Mini Grand', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/mini-grand.html', dl: '' },
    { n: 'Velvet', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/velvet.html', dl: '' },
    { n: 'Strike', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/strike.html', dl: '' },
    { n: 'Structure', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/structure-2.html', dl: '' },
    { n: 'Transfuser', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/transfuser-2.html', dl: '' },
    { n: 'Vacuum Pro', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/vacuum-pro.html', dl: '' },
    { n: 'Loom II', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/loom-ii.html', dl: '' },
    { n: 'the RISER', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/the-riser.html', dl: '' },
    { n: 'DB-33', m: 'AIR Music Tech', c: 'インストゥルメント', a: 'iLok', u: 'https://www.airmusictech.com/virtual-instruments/db-33.html', dl: '' },
    // --- Sonivox (expanded) ---
    { n: 'Film Score Companion', m: 'Sonivox', c: 'インストゥルメント', a: 'iLok', u: 'https://sonivoxmi.com/products/details/film-score-companion', dl: '' },
    { n: 'Orchestral Companion Strings', m: 'Sonivox', c: 'インストゥルメント', a: 'iLok', u: 'https://sonivoxmi.com/products/details/orchestral-companion-strings', dl: '' },
    { n: 'Orchestral Companion Brass', m: 'Sonivox', c: 'インストゥルメント', a: 'iLok', u: 'https://sonivoxmi.com/products/details/orchestral-companion-brass', dl: '' },
    { n: 'Orchestral Companion Woodwinds', m: 'Sonivox', c: 'インストゥルメント', a: 'iLok', u: 'https://sonivoxmi.com/products/details/orchestral-companion-woodwinds', dl: '' },
    { n: 'Big Bang Cinematic Percussion', m: 'Sonivox', c: 'インストゥルメント', a: 'iLok', u: 'https://sonivoxmi.com/products/details/big-bang-cinematic-percussion-2', dl: '' },
    // --- AKAI Professional ---
    { n: 'MPC 2 Software', m: 'AKAI Professional', c: 'インストゥルメント', a: 'iLok', u: 'https://www.akaipro.com/mpc-software-2', dl: '' },
    { n: 'VIP 3.1', m: 'AKAI Professional', c: 'ユーティリティ', a: 'iLok', u: 'https://www.akaipro.com/vip', dl: '' },
    // --- Applied Acoustics Systems (AAS) ---
    { n: 'Strum GS-2', m: 'AAS', c: 'インストゥルメント', a: '独自認証', u: 'https://www.applied-acoustics.com/strum-gs-2/', dl: '' },
    { n: 'Lounge Lizard EP-4', m: 'AAS', c: 'インストゥルメント', a: '独自認証', u: 'https://www.applied-acoustics.com/lounge-lizard-ep-4/', dl: '' },
    { n: 'Ultra Analog VA-3', m: 'AAS', c: 'インストゥルメント', a: '独自認証', u: 'https://www.applied-acoustics.com/ultra-analog-va-3/', dl: '' },
    { n: 'String Studio VS-3', m: 'AAS', c: 'インストゥルメント', a: '独自認証', u: 'https://www.applied-acoustics.com/string-studio-vs-3/', dl: '' },
    { n: 'Chromaphone 3', m: 'AAS', c: 'インストゥルメント', a: '独自認証', u: 'https://www.applied-acoustics.com/chromaphone-3/', dl: '' },
    // --- UVI (expanded) ---
    { n: 'Falcon 3', m: 'UVI', c: 'インストゥルメント', a: 'iLok', u: 'https://www.uvi.net/falcon', dl: '' },
    { n: 'Vintage Vault 4', m: 'UVI', c: 'バンドル', a: 'iLok', u: 'https://www.uvi.net/vintage-vault-4', dl: '' },
    { n: 'Synth Anthology 4', m: 'UVI', c: 'インストゥルメント', a: 'iLok', u: 'https://www.uvi.net/synth-anthology-4', dl: '' },
    { n: 'World Suite 2', m: 'UVI', c: 'インストゥルメント', a: 'iLok', u: 'https://www.uvi.net/world-suite-2', dl: '' },
    { n: 'Orchestral Suite', m: 'UVI', c: 'インストゥルメント', a: 'iLok', u: 'https://www.uvi.net/orchestral-suite', dl: '' },
    { n: 'Shade', m: 'UVI', c: 'エフェクト', a: 'iLok', u: 'https://www.uvi.net/shade', dl: '' },
    { n: 'Plate', m: 'UVI', c: 'エフェクト', a: 'iLok', u: 'https://www.uvi.net/plate', dl: '' },
    // --- Rob Papen (expanded) ---
    { n: 'eXplorer 8', m: 'Rob Papen', c: 'バンドル', a: '独自認証', u: 'https://www.robpapen.com/explorer-8.html', dl: '' },
    { n: 'Predator 3', m: 'Rob Papen', c: 'インストゥルメント', a: '独自認証', u: 'https://www.robpapen.com/predator-3.html', dl: '' },
    { n: 'Blue III', m: 'Rob Papen', c: 'インストゥルメント', a: '独自認証', u: 'https://www.robpapen.com/blue3.html', dl: '' },
    { n: 'SubBoomBass 2', m: 'Rob Papen', c: 'インストゥルメント', a: '独自認証', u: 'https://www.robpapen.com/subboombass-2.html', dl: '' },
    { n: 'Punch 2', m: 'Rob Papen', c: 'インストゥルメント', a: '独自認証', u: 'https://www.robpapen.com/punch-2.html', dl: '' },
    // --- KV331 Audio ---
    { n: 'SynthMaster 2', m: 'KV331 Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://www.kv331audio.com/synthmaster.aspx', dl: '' },
    { n: 'SynthMaster One', m: 'KV331 Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://www.kv331audio.com/synthmasterone.aspx', dl: '' },
    { n: 'SynthMaster 3', m: 'KV331 Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://www.kv331audio.com/', dl: '' },
    // --- GForce Software ---
    { n: 'Minimonsta2', m: 'GForce Software', c: 'インストゥルメント', a: '独自認証', u: 'https://www.gforcesoftware.com/products/minimonsta2/', dl: '' },
    { n: 'Oddity3', m: 'GForce Software', c: 'インストゥルメント', a: '独自認証', u: 'https://www.gforcesoftware.com/products/oddity3/', dl: '' },
    { n: 'Oberheim OB-E', m: 'GForce Software', c: 'インストゥルメント', a: '独自認証', u: 'https://www.gforcesoftware.com/products/oberheim-ob-e/', dl: '' },
    { n: 'Oberheim SEM', m: 'GForce Software', c: 'インストゥルメント', a: '独自認証', u: 'https://www.gforcesoftware.com/products/oberheim-sem/', dl: '' },
    { n: 'M-Tron Pro IV', m: 'GForce Software', c: 'インストゥルメント', a: '独自認証', u: 'https://www.gforcesoftware.com/products/m-tron-pro-iv/', dl: '' },
    // --- Cherry Audio (expanded) ---
    { n: 'GX-80', m: 'Cherry Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://cherryaudio.com/products/gx-80', dl: '' },
    { n: 'Elka-X', m: 'Cherry Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://cherryaudio.com/products/elka-x', dl: '' },
    { n: 'Mercury-6', m: 'Cherry Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://cherryaudio.com/products/mercury-6', dl: '' },
    { n: 'Novachord + Solovox', m: 'Cherry Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://cherryaudio.com/products/novachord-solovox', dl: '' },
    { n: 'Sines', m: 'Cherry Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://cherryaudio.com/products/sines', dl: '' },
    // --- Softube (expanded) ---
    { n: 'Console 1 Channel Mk III', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/console-1-channel-mk-iii', dl: '' },
    { n: 'Weiss EQ1', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/weiss-eq1', dl: '' },
    { n: 'Weiss DS1-MK3', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/weiss-ds1-mk3', dl: '' },
    { n: 'Weiss MM-1', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/weiss-mm-1', dl: '' },
    { n: 'Empirical Labs Mike-E', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/mike-e', dl: '' },
    { n: 'Empirical Labs Lil FrEQ', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/lil-freq', dl: '' },
    { n: 'Chandler Limited Curve Bender', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/curve-bender', dl: '' },
    { n: 'Chandler Limited Zener Limiter', m: 'Softube', c: 'エフェクト', a: 'iLok', u: 'https://www.softube.com/zener-limiter', dl: '' },
    // --- Plugin Alliance (expanded) ---
    { n: 'Shadow Hills Mastering Compressor Class A', m: 'Brainworx', c: 'エフェクト', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/shadow_hills_mastering_compressor_class_a.html', dl: '' },
    { n: 'Knifonium', m: 'Knif Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/knif_audio_knifonium.html', dl: '' },
    { n: 'Thorn', m: 'DS Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/ds_thorn.html', dl: '' },
    { n: 'Lion', m: 'Unfiltered Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/unfiltered_audio_lion.html', dl: '' },
    { n: 'BYOME', m: 'Unfiltered Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/unfiltered_audio_byome.html', dl: '' },
    { n: 'TRIAD', m: 'Unfiltered Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/unfiltered_audio_triad.html', dl: '' },
    { n: 'SILO', m: 'Unfiltered Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.plugin-alliance.com/en/products/unfiltered_audio_silo.html', dl: '' },
    // --- Metric Halo ---
    { n: 'ChannelStrip 3', m: 'Metric Halo', c: 'エフェクト', a: 'iLok', u: 'https://mhsecure.com/metric_halo/products/software/channelstrip-3.html', dl: '' },
    { n: 'Character', m: 'Metric Halo', c: 'エフェクト', a: 'iLok', u: 'https://mhsecure.com/metric_halo/products/software/character.html', dl: '' },
    { n: 'HaloVerb', m: 'Metric Halo', c: 'エフェクト', a: 'iLok', u: 'https://mhsecure.com/metric_halo/products/software/haloverb.html', dl: '' },
    { n: 'Dirty Delay', m: 'Metric Halo', c: 'エフェクト', a: 'iLok', u: 'https://mhsecure.com/metric_halo/products/software/dirty-delay.html', dl: '' },
    // --- McDSP ---
    { n: '6050 Ultimate Channel Strip', m: 'McDSP', c: 'エフェクト', a: 'iLok', u: 'https://mcdsp.com/plugin-index/6050-ultimate-channel-strip/', dl: '' },
    { n: '6060 Ultimate Module Collection', m: 'McDSP', c: 'エフェクト', a: 'iLok', u: 'https://mcdsp.com/plugin-index/6060-ultimate-module-collection/', dl: '' },
    { n: 'FutzBox', m: 'McDSP', c: 'エフェクト', a: 'iLok', u: 'https://mcdsp.com/plugin-index/futzbox/', dl: '' },
    { n: 'ML4000', m: 'McDSP', c: 'エフェクト', a: 'iLok', u: 'https://mcdsp.com/plugin-index/ml4000/', dl: '' },
    { n: 'Analog Channel', m: 'McDSP', c: 'エフェクト', a: 'iLok', u: 'https://mcdsp.com/plugin-index/analog-channel/', dl: '' },
    // --- Eventide (expanded) ---
    { n: 'SplitEQ', m: 'Eventide', c: 'エフェクト', a: 'iLok', u: 'https://www.eventideaudio.com/plug-ins/spliteq/', dl: '' },
    { n: 'Physion Mk II', m: 'Eventide', c: 'エフェクト', a: 'iLok', u: 'https://www.eventideaudio.com/plug-ins/physion-mk-ii/', dl: '' },
    { n: 'Tverb', m: 'Eventide', c: 'エフェクト', a: 'iLok', u: 'https://www.eventideaudio.com/plug-ins/tverb/', dl: '' },
    { n: 'UltraChannel', m: 'Eventide', c: 'エフェクト', a: 'iLok', u: 'https://www.eventideaudio.com/plug-ins/ultrachannel/', dl: '' },
    // --- Sound Particles ---
    { n: 'SkyDust 3D', m: 'Sound Particles', c: 'インストゥルメント', a: '独自認証', u: 'https://soundparticles.com/products/skydust', dl: '' },
    { n: 'Density', m: 'Sound Particles', c: 'エフェクト', a: '独自認証', u: 'https://soundparticles.com/products/density', dl: '' },
    { n: 'Energy Panner', m: 'Sound Particles', c: 'エフェクト', a: '独自認証', u: 'https://soundparticles.com/products/energypanner', dl: '' },
    // --- Vienna Symphonic Library (VSL) ---
    { n: 'Vienna Synchron Player', m: 'VSL', c: 'インストゥルメント', a: 'iLok', u: 'https://www.vsl.co.at/', dl: '' },
    { n: 'Vienna Ensemble Pro 7', m: 'VSL', c: 'ユーティリティ', a: 'iLok', u: 'https://www.vsl.co.at/en/Vienna_Software_Package/Vienna_Ensemble_Pro', dl: '' },
    { n: 'Vienna Suite Pro', m: 'VSL', c: 'エフェクト', a: 'iLok', u: 'https://www.vsl.co.at/en/Vienna_Software_Package/Vienna_Suite_Pro', dl: '' },
    // --- Synchro Arts ---
    { n: 'VocAlign Project 5', m: 'Synchro Arts', c: 'エフェクト', a: 'iLok', u: 'https://www.synchroarts.com/products/vocalign-project-5/overview', dl: '' },
    { n: 'VocAlign Ultra', m: 'Synchro Arts', c: 'エフェクト', a: 'iLok', u: 'https://www.synchroarts.com/products/vocalign-ultra/overview', dl: '' },
    { n: 'Revoice Pro 5', m: 'Synchro Arts', c: 'ユーティリティ', a: 'iLok', u: 'https://www.synchroarts.com/products/revoice-pro-5/overview', dl: '' },
    // --- Audio Ease ---
    { n: 'Altiverb 7', m: 'Audio Ease', c: 'エフェクト', a: 'iLok', u: 'https://www.audioease.com/altiverb/', dl: '' },
    { n: 'Speakerphone 2', m: 'Audio Ease', c: 'エフェクト', a: 'iLok', u: 'https://www.audioease.com/speakerphone/', dl: '' },
    { n: 'Indoor', m: 'Audio Ease', c: 'エフェクト', a: 'iLok', u: 'https://www.audioease.com/indoor/', dl: '' },
    // --- LiquidSonics ---
    { n: 'Seventh Heaven', m: 'LiquidSonics', c: 'エフェクト', a: 'iLok', u: 'https://www.liquidsonics.com/software/seventh-heaven/', dl: '' },
    { n: 'Cinematic Rooms', m: 'LiquidSonics', c: 'エフェクト', a: 'iLok', u: 'https://www.liquidsonics.com/software/cinematic-rooms/', dl: '' },
    { n: 'Lustrous Plates', m: 'LiquidSonics', c: 'エフェクト', a: 'iLok', u: 'https://www.liquidsonics.com/software/lustrous-plates/', dl: '' },
    // --- Leapwing Audio (expanded) ---
    { n: 'DynOne', m: 'Leapwing Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.leapwingaudio.com/products/dynone/', dl: '' },
    { n: 'CenterOne', m: 'Leapwing Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.leapwingaudio.com/products/centerone/', dl: '' },
    { n: 'StageOne', m: 'Leapwing Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.leapwingaudio.com/products/stageone/', dl: '' },
    { n: 'RootOne', m: 'Leapwing Audio', c: 'エフェクト', a: '独自認証', u: 'https://www.leapwingaudio.com/products/rootone/', dl: '' },
    // --- Oeksound (expanded) ---
    { n: 'Spiff', m: 'oeksound', c: 'エフェクト', a: 'iLok', u: 'https://oeksound.com/plugins/spiff/', dl: '' },
    // --- Plogue ---
    { n: 'chipspeech', m: 'Plogue', c: 'インストゥルメント', a: '独自認証', u: 'https://www.plogue.com/products/chipspeech.html', dl: '' },
    { n: 'chipsounds', m: 'Plogue', c: 'インストゥルメント', a: '独自認証', u: 'https://www.plogue.com/products/chipsounds.html', dl: '' },
    { n: 'chipcrusher', m: 'Plogue', c: 'エフェクト', a: '独自認証', u: 'https://www.plogue.com/products/chipcrusher.html', dl: '' },
    // --- Inphonik ---
    { n: 'RX950', m: 'Inphonik', c: 'エフェクト', a: '独自認証', u: 'https://www.inphonik.com/products/rx950-classic-ad-da-converter/', dl: '' },
    { n: 'RYM2612', m: 'Inphonik', c: 'インストゥルメント', a: '独自認証', u: 'https://www.inphonik.com/products/rym2612-iconic-fm-synthesizer/', dl: '' },
    // --- TAL (expanded) ---
    { n: 'TAL-U-NO-LX', m: 'TAL Software', c: 'インストゥルメント', a: '独自認証', u: 'https://tal-software.com/products/tal-u-no-lx', dl: '' },
    { n: 'TAL-BassLine-101', m: 'TAL Software', c: 'インストゥルメント', a: '独自認証', u: 'https://tal-software.com/products/tal-bassline-101', dl: '' },
    { n: 'TAL-J-8', m: 'TAL Software', c: 'インストゥルメント', a: '独自認証', u: 'https://tal-software.com/products/tal-j-8', dl: '' },
    { n: 'TAL-Sampler', m: 'TAL Software', c: 'インストゥルメント', a: '独自認証', u: 'https://tal-software.com/products/tal-sampler', dl: '' },
    { n: 'TAL-Drum', m: 'TAL Software', c: 'インストゥルメント', a: '独自認証', u: 'https://tal-software.com/products/tal-drum', dl: '' },
    // --- AudioRealism ---
    { n: 'Bass Line 3', m: 'AudioRealism', c: 'インストゥルメント', a: '独自認証', u: 'https://www.audiorealism.se/abl3.html', dl: '' },
    { n: 'Drum Machine', m: 'AudioRealism', c: 'インストゥルメント', a: '独自認証', u: 'https://www.audiorealism.se/adm.html', dl: '' },
    { n: 'ReDominator', m: 'AudioRealism', c: 'インストゥルメント', a: '独自認証', u: 'https://www.audiorealism.se/redominator.html', dl: '' },
    // --- D16 Group (expanded) ---
    { n: 'Phoscyon 2', m: 'D16 Group', c: 'インストゥルメント', a: '独自認証', u: 'https://d16.pl/phoscyon2', dl: '' },
    { n: 'Drumazon 2', m: 'D16 Group', c: 'インストゥルメント', a: '独自認証', u: 'https://d16.pl/drumazon2', dl: '' },
    { n: 'Nepheton', m: 'D16 Group', c: 'インストゥルメント', a: '独自認証', u: 'https://d16.pl/nepheton', dl: '' },
    { n: 'Nithonat', m: 'D16 Group', c: 'インストゥルメント', a: '独自認証', u: 'https://d16.pl/nithonat', dl: '' },
    { n: 'LuSH-101', m: 'D16 Group', c: 'インストゥルメント', a: '独自認証', u: 'https://d16.pl/lush101', dl: '' },
    { n: 'Decimort 2', m: 'D16 Group', c: 'エフェクト', a: '独自認証', u: 'https://d16.pl/decimort2', dl: '' },
    { n: 'Devastor 2', m: 'D16 Group', c: 'エフェクト', a: '独自認証', u: 'https://d16.pl/devastor2', dl: '' },
    // --- Sonic Charge ---
    { n: 'Synplant 2', m: 'Sonic Charge', c: 'インストゥルメント', a: '独自認証', u: 'https://soniccharge.com/synplant', dl: '' },
    { n: 'Microtonic', m: 'Sonic Charge', c: 'インストゥルメント', a: '独自認証', u: 'https://soniccharge.com/microtonic', dl: '' },
    { n: 'Permut8', m: 'Sonic Charge', c: 'エフェクト', a: '独自認証', u: 'https://soniccharge.com/permut8', dl: '' },
    { n: 'Echobode', m: 'Sonic Charge', c: 'エフェクト', a: '独自認証', u: 'https://soniccharge.com/echobode', dl: '' },
    { n: 'Bitspeek', m: 'Sonic Charge', c: 'エフェクト', a: '独自認証', u: 'https://soniccharge.com/bitspeek', dl: '' },
    // --- Sugar Bytes ---
    { n: 'Effectrix 2', m: 'Sugar Bytes', c: 'エフェクト', a: '独自認証', u: 'https://sugar-bytes.de/effectrix2', dl: '' },
    { n: 'Turnado', m: 'Sugar Bytes', c: 'エフェクト', a: '独自認証', u: 'https://sugar-bytes.de/turnado', dl: '' },
    { n: 'Wow 2', m: 'Sugar Bytes', c: 'エフェクト', a: '独自認証', u: 'https://sugar-bytes.de/wow2', dl: '' },
    { n: 'Cyclop', m: 'Sugar Bytes', c: 'インストゥルメント', a: '独自認証', u: 'https://sugar-bytes.de/cyclop', dl: '' },
    { n: 'Factory', m: 'Sugar Bytes', c: 'インストゥルメント', a: '独自認証', u: 'https://sugar-bytes.de/factory', dl: '' },
    // --- Image-Line (expanded) ---
    { n: 'Harmor', m: 'Image-Line', c: 'インストゥルメント', a: '独自認証', u: 'https://www.image-line.com/fl-studio/plugins/harmor', dl: '' },
    { n: 'Sytrus', m: 'Image-Line', c: 'インストゥルメント', a: '独自認証', u: 'https://www.image-line.com/fl-studio/plugins/sytrus', dl: '' },
    { n: 'Gross Beat', m: 'Image-Line', c: 'エフェクト', a: '独自認証', u: 'https://www.image-line.com/fl-studio/plugins/gross-beat', dl: '' },
    { n: 'Maximus', m: 'Image-Line', c: 'エフェクト', a: '独自認証', u: 'https://www.image-line.com/fl-studio/plugins/maximus', dl: '' },
    // --- MeldaProduction (expanded) ---
    { n: 'MSoundFactory', m: 'MeldaProduction', c: 'インストゥルメント', a: '独自認証', u: 'https://www.meldaproduction.com/MSoundFactory', dl: '' },
    { n: 'MPowerSynth', m: 'MeldaProduction', c: 'インストゥルメント', a: '独自認証', u: 'https://www.meldaproduction.com/MPowerSynth', dl: '' },
    { n: 'MDrummer', m: 'MeldaProduction', c: 'インストゥルメント', a: '独自認証', u: 'https://www.meldaproduction.com/MDrummer', dl: '' },
    { n: 'MAutoAlign', m: 'MeldaProduction', c: 'エフェクト', a: '独自認証', u: 'https://www.meldaproduction.com/MAutoAlign', dl: '' },
    { n: 'MAutoDynamicEq', m: 'MeldaProduction', c: 'エフェクト', a: '独自認証', u: 'https://www.meldaproduction.com/MAutoDynamicEq', dl: '' },
    // --- Voxengo (expanded) ---
    { n: 'SPAN Plus', m: 'Voxengo', c: 'ユーティリティ', a: '独自認証', u: 'https://www.voxengo.com/product/spanplus/', dl: '' },
    { n: 'Elephant', m: 'Voxengo', c: 'エフェクト', a: '独自認証', u: 'https://www.voxengo.com/product/elephant/', dl: '' },
    { n: 'GlissEQ', m: 'Voxengo', c: 'エフェクト', a: '独自認証', u: 'https://www.voxengo.com/product/glisseq/', dl: '' },
    // --- Togu Audio Line (TAL) Free ---
    { n: 'TAL-Chorus-LX', m: 'TAL Software', c: 'エフェクト', a: '無料', u: 'https://tal-software.com/products/tal-chorus-lx', dl: '' },
    { n: 'TAL-Reverb-4', m: 'TAL Software', c: 'エフェクト', a: '無料', u: 'https://tal-software.com/products/tal-reverb-4', dl: '' },
    { n: 'TAL-Filter-2', m: 'TAL Software', c: 'エフェクト', a: '無料', u: 'https://tal-software.com/products/tal-filter-2', dl: '' },
    { n: 'TAL-Vocoder', m: 'TAL Software', c: 'エフェクト', a: '無料', u: 'https://tal-software.com/products/tal-vocoder', dl: '' },
    // --- Vital Audio Free ---
    { n: 'Vital Basic', m: 'Vital Audio', c: 'インストゥルメント', a: '無料', u: 'https://vital.audio/', dl: '' },
    // --- Valhalla Free ---
    { n: 'Valhalla Supermassive', m: 'Valhalla DSP', c: 'エフェクト', a: '無料', u: 'https://valhalladsp.com/shop/reverb/valhalla-supermassive/', dl: '' },
    { n: 'Valhalla Freq Echo', m: 'Valhalla DSP', c: 'エフェクト', a: '無料', u: 'https://valhalladsp.com/shop/delay/valhalla-freq-echo/', dl: '' },
    { n: 'Valhalla Space Modulator', m: 'Valhalla DSP', c: 'エフェクト', a: '無料', u: 'https://valhalladsp.com/shop/modulation/valhalla-space-modulator/', dl: '' },
    // --- U-he Free ---
    { n: 'Tyrell N6', m: 'u-he', c: 'インストゥルメント', a: '無料', u: 'https://u-he.com/products/tyrelln6/', dl: '' },
    { n: 'Zebralette', m: 'u-he', c: 'インストゥルメント', a: '無料', u: 'https://u-he.com/products/zebralette/', dl: '' },
    { n: 'Podolski', m: 'u-he', c: 'インストゥルメント', a: '無料', u: 'https://u-he.com/products/podolski/', dl: '' },
    { n: 'Triple Cheese', m: 'u-he', c: 'インストゥルメント', a: '無料', u: 'https://u-he.com/products/triplecheese/', dl: '' },
    // --- Full Bucket Music (expanded) ---
    { n: 'Mono/Fury', m: 'Full Bucket Music', c: 'インストゥルメント', a: '無料', u: 'https://www.fullbucket.de/music/monofury.html', dl: '' },
    { n: 'Deputy Mark II', m: 'Full Bucket Music', c: 'インストゥルメント', a: '無料', u: 'https://www.fullbucket.de/music/deputy.html', dl: '' },
    { n: 'ModulAir', m: 'Full Bucket Music', c: 'インストゥルメント', a: '無料', u: 'https://www.fullbucket.de/music/modulair.html', dl: '' },
    { n: 'FB-3300', m: 'Full Bucket Music', c: 'インストゥルメント', a: '無料', u: 'https://www.fullbucket.de/music/fb3300.html', dl: '' },
    { n: 'FB-3200', m: 'Full Bucket Music', c: 'インストゥルメント', a: '無料', u: 'https://www.fullbucket.de/music/fb3200.html', dl: '' },
    { n: 'FB-3100', m: 'Full Bucket Music', c: 'インストゥルメント', a: '無料', u: 'https://www.fullbucket.de/music/fb3100.html', dl: '' },
    // --- Spitfire Free (LABS) - already covered but adding specific libraries as entries ---
    { n: 'LABS Soft Piano', m: 'Spitfire Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://labs.spitfireaudio.com/soft-piano', dl: '' },
    { n: 'LABS Strings', m: 'Spitfire Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://labs.spitfireaudio.com/strings', dl: '' },
    { n: 'LABS Drums', m: 'Spitfire Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://labs.spitfireaudio.com/drums', dl: '' },
    { n: 'LABS Electric Piano', m: 'Spitfire Audio', c: 'インストゥルメント', a: '独自認証', u: 'https://labs.spitfireaudio.com/electric-piano', dl: '' },
    // --- Orchestral Tools Free (SINEfactory) ---
    { n: 'Layers', m: 'Orchestral Tools', c: 'インストゥルメント', a: '独自認証', u: 'https://www.orchestraltools.com/sinefactory', dl: '' },
    { n: 'Rotary', m: 'Orchestral Tools', c: 'インストゥルメント', a: '独自認証', u: 'https://www.orchestraltools.com/sinefactory', dl: '' },
    { n: 'Helix', m: 'Orchestral Tools', c: 'インストゥルメント', a: '独自認証', u: 'https://www.orchestraltools.com/sinefactory', dl: '' },
    { n: 'Strand', m: 'Orchestral Tools', c: 'インストゥルメント', a: '独自認証', u: 'https://www.orchestraltools.com/sinefactory', dl: '' },
    // --- ProjectSAM Free ---
    { n: 'The Free Orchestra', m: 'ProjectSAM', c: 'インストゥルメント', a: 'Native Access', u: 'https://projectsam.com/libraries/the-free-orchestra', dl: '' },
    { n: 'The Free Orchestra 2', m: 'ProjectSAM', c: 'インストゥルメント', a: 'Native Access', u: 'https://projectsam.com/libraries/the-free-orchestra-2', dl: '' },
    // --- Heavyocity Free ---
    { n: 'Foundations Piano', m: 'Heavyocity', c: 'インストゥルメント', a: 'Native Access', u: 'https://heavyocity.com/product/foundations-piano/', dl: '' },
    { n: 'Foundations Staccato Strings', m: 'Heavyocity', c: 'インストゥルメント', a: 'Native Access', u: 'https://heavyocity.com/product/foundations-staccato-strings/', dl: '' },
    { n: 'Foundations Synth Bass', m: 'Heavyocity', c: 'インストゥルメント', a: 'Native Access', u: 'https://heavyocity.com/product/foundations-synth-bass/', dl: '' },
    // --- Crow Hill ---
    { n: 'Vaults', m: 'Crow Hill', c: 'インストゥルメント', a: '独自認証', u: 'https://thecrowhillcompany.com/vaults/', dl: '' },
    // --- Pianobook (Community) ---
    { n: 'Pianobook Library', m: 'Pianobook', c: 'インストゥルメント', a: 'その他', u: 'https://www.pianobook.co.uk/', dl: '' },
    // --- Decent Samples ---
    { n: 'Decent Sampler', m: 'Decent Samples', c: 'インストゥルメント', a: '無料', u: 'https://www.decentsamples.com/product/decent-sampler-plugin/', dl: '' },
    // --- Plogue Free ---
    { n: 'Alter/Ego', m: 'Plogue', c: 'インストゥルメント', a: '無料', u: 'https://www.plogue.com/products/alter-ego.html', dl: '' },
    // --- Tokyo Dawn Records Free ---
    { n: 'TDR Nova', m: 'Tokyo Dawn Records', c: 'エフェクト', a: '無料', u: 'https://www.tokyodawn.net/tdr-nova/', dl: '' },
    { n: 'TDR Kotelnikov', m: 'Tokyo Dawn Records', c: 'エフェクト', a: '無料', u: 'https://www.tokyodawn.net/tdr-kotelnikov/', dl: '' },
    { n: 'TDR VOS SlickEQ', m: 'Tokyo Dawn Records', c: 'エフェクト', a: '無料', u: 'https://www.tokyodawn.net/tdr-vos-slickeq/', dl: '' },
    // --- Klanghelm Free ---
    { n: 'MJUC jr.', m: 'Klanghelm', c: 'エフェクト', a: '無料', u: 'https://klanghelm.com/contents/products/MJUCjr.html', dl: '' },
    { n: 'IVGI', m: 'Klanghelm', c: 'エフェクト', a: '無料', u: 'https://klanghelm.com/contents/products/IVGI.html', dl: '' },
    { n: 'DC1A', m: 'Klanghelm', c: 'エフェクト', a: '無料', u: 'https://klanghelm.com/contents/products/DC1A.html', dl: '' },
    // --- MeldaProduction Free ---
    { n: 'MFreeFXBundle', m: 'MeldaProduction', c: 'バンドル', a: '無料', u: 'https://www.meldaproduction.com/MFreeFXBundle', dl: '' },
    // --- Blue Cat Audio Free ---
    { n: 'Blue Cats Freeware Pack', m: 'Blue Cat Audio', c: 'バンドル', a: '無料', u: 'https://www.bluecataudio.com/Products/Bundle_FreewarePack/', dl: '' },
    // --- Voxengo Free ---
    { n: 'SPAN', m: 'Voxengo', c: 'ユーティリティ', a: '無料', u: 'https://www.voxengo.com/product/span/', dl: '' },
    { n: 'OldSkoolVerb', m: 'Voxengo', c: 'エフェクト', a: '無料', u: 'https://www.voxengo.com/product/oldskoolverb/', dl: '' },
    // --- Venn Audio ---
    { n: 'Free Clip', m: 'Venn Audio', c: 'エフェクト', a: '無料', u: 'https://www.vennaudio.com/free-clip/', dl: '' },
    // --- Xfer Free ---
    { n: 'OTT', m: 'Xfer Records', c: 'エフェクト', a: '無料', u: 'https://xferrecords.com/freeware', dl: '' },
    { n: 'Dimension Expander', m: 'Xfer Records', c: 'エフェクト', a: '無料', u: 'https://xferrecords.com/freeware', dl: '' },
    // --- Kilohearts Free ---
    { n: 'Kilohearts Essentials', m: 'Kilohearts', c: 'バンドル', a: '無料', u: 'https://kilohearts.com/products/kilohearts_essentials', dl: '' },
    // --- Analog Obsession (expanded free) ---
    { n: 'LALA', m: 'Analog Obsession', c: 'エフェクト', a: '無料', u: 'https://www.patreon.com/posts/lala-36128829', dl: '' },
    { n: 'FETBundle', m: 'Analog Obsession', c: 'バンドル', a: '無料', u: 'https://www.patreon.com/posts/fetbundle-45638706', dl: '' },
    { n: 'KONSOL', m: 'Analog Obsession', c: 'エフェクト', a: '無料', u: 'https://www.patreon.com/posts/konsol-34420510', dl: '' },
    // --- Variety Of Sound ---
    { n: 'FerricTDS', m: 'Variety Of Sound', c: 'エフェクト', a: '無料', u: 'https://varietyofsound.wordpress.com/ferrictds/', dl: '' },
    { n: 'EpicVerb', m: 'Variety Of Sound', c: 'エフェクト', a: '無料', u: 'https://varietyofsound.wordpress.com/epicverb/', dl: '' },
    // --- Ignite Amps ---
    { n: 'Emissary', m: 'Ignite Amps', c: 'エフェクト', a: '無料', u: 'http://www.igniteamps.com/#emissary', dl: '' },
    { n: 'NadIR', m: 'Ignite Amps', c: 'エフェクト', a: '無料', u: 'http://www.igniteamps.com/#nadir', dl: '' },
    // --- LePou ---
    { n: 'Le456', m: 'LePou', c: 'エフェクト', a: '無料', u: 'https://impulserecord.com/project/lepou-plugins/', dl: '' },
    { n: 'Hybrit', m: 'LePou', c: 'エフェクト', a: '無料', u: 'https://impulserecord.com/project/lepou-plugins/', dl: '' },
    // --- TSE Audio ---
    { n: 'TSE 808', m: 'TSE Audio', c: 'エフェクト', a: '無料', u: 'https://www.tseaudio.com/software/tse808', dl: '' },
    { n: 'TSE R47', m: 'TSE Audio', c: 'エフェクト', a: '無料', u: 'https://www.tseaudio.com/software/tseR47', dl: '' },
    // --- Mercuriall ---
    { n: 'Tube Screamer 808', m: 'Mercuriall', c: 'エフェクト', a: '無料', u: 'https://mercuriall.com/cms/details_freestuff', dl: '' },
    // --- Neural DSP (Archetype Free Trials/Standalone?) no, paid mostly ---
    // --- Chowdhury DSP ---
    { n: 'Chow Tape Model', m: 'Chowdhury DSP', c: 'エフェクト', a: '無料', u: 'https://chowdsp.com/products.html', dl: '' },
    { n: 'Chow Matrix', m: 'Chowdhury DSP', c: 'エフェクト', a: '無料', u: 'https://chowdsp.com/products.html', dl: '' },
    // --- Aberrant DSP ---
    { n: 'SketchCassette II', m: 'Aberrant DSP', c: 'エフェクト', a: '独自認証', u: 'https://aberrantdsp.com/plugins/sketchcassette-ii/', dl: '' },
    { n: 'ShapeShifter', m: 'Aberrant DSP', c: 'エフェクト', a: '独自認証', u: 'https://aberrantdsp.com/plugins/shapeshifter/', dl: '' },
    { n: 'Digitalis', m: 'Aberrant DSP', c: 'エフェクト', a: '独自認証', u: 'https://aberrantdsp.com/plugins/digitalis/', dl: '' },
    // --- Goodhertz (expanded) ---
    { n: 'Vulf Compressor', m: 'Goodhertz', c: 'エフェクト', a: '独自認証', u: 'https://goodhertz.com/vulf-compressor/', dl: '' },
    { n: 'Wow Control', m: 'Goodhertz', c: 'エフェクト', a: '独自認証', u: 'https://goodhertz.com/wow-control/', dl: '' },
    { n: 'Trem Control', m: 'Goodhertz', c: 'エフェクト', a: '独自認証', u: 'https://goodhertz.com/trem-control/', dl: '' },
    { n: 'Lossy', m: 'Goodhertz', c: 'エフェクト', a: '独自認証', u: 'https://goodhertz.com/lossy/', dl: '' },
    { n: 'Loh', m: 'Goodhertz', c: 'エフェクト', a: '独自認証', u: 'https://goodhertz.com/loh/', dl: '' },
    { n: 'CanOpener Studio', m: 'Goodhertz', c: 'ユーティリティ', a: '独自認証', u: 'https://goodhertz.com/canopener-studio/', dl: '' },
    // --- Cableguys (expanded) ---
    { n: 'HalfTime', m: 'Cableguys', c: 'エフェクト', a: '独自認証', u: 'https://www.cableguys.com/halftime.html', dl: '' },
    { n: 'Curve 2', m: 'Cableguys', c: 'インストゥルメント', a: '独自認証', u: 'https://www.cableguys.com/curve.html', dl: '' },
    // --- FabFilter (expanded) ---
    { n: 'Pro-DS', m: 'FabFilter', c: 'エフェクト', a: '独自認証', u: 'https://www.fabfilter.com/products/pro-ds-de-esser-plug-in', dl: '' },
    { n: 'Pro-G', m: 'FabFilter', c: 'エフェクト', a: '独自認証', u: 'https://www.fabfilter.com/products/pro-g-gate-expander-plug-in', dl: '' },
    { n: 'Twin 3', m: 'FabFilter', c: 'インストゥルメント', a: '独自認証', u: 'https://www.fabfilter.com/products/twin-3-synthesizer-plug-in', dl: '' },
    // --- Done ---
];
`;

content += finalBatch;

fs.writeFileSync(dbPath, content, 'utf8');
console.log('Successfully fixed encoding and appended plugins.');
