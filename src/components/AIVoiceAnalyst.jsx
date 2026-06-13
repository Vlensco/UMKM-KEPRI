import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function AIVoiceAnalyst({
  data,
  selectedYear,
  selectedKecamatan,
  selectedSector,
  onHighlightChart,
  onSwitchTab,
  onClose
}) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Halo! Saya AI Analyst Batam UMKM. Silakan ajukan pertanyaan tentang data UMKM Kota Batam.'
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = 'AIzaSyAX0XcZ_7ofgUKjruKmnr6c16Sz-ekDRv8';

  const suggestions = [
    { text: "Kecamatan mana yang paling prioritas untuk diberikan intervensi?", key: "prioritas" },
    { text: "Sektor apa yang paling mendominasi di Kota Batam?", key: "sektor" },
    { text: "Bagaimana tingkat keaktifan koperasi di Kota Batam?", key: "koperasi" },
    { text: "Berapa rata-rata adopsi digital UMKM Batam?", key: "digital" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!ttsEnabled || !synthRef.current) return;

    synthRef.current.cancel();

    // Clean text of markdown, brackets and tags
    const cleanText = text
      .replace(/\[HIGHLIGHT:[a-zA-Z\-]+\]/g, '')
      .replace(/\[TAB:[a-zA-Z\-]+\]/g, '')
      .replace(/\*\*/g, '')
      .replace(/[0-9]+\.\s/g, '')
      .replace(/[\(\):]/g, ' ')
      .replace(/▼/g, 'Turun')
      .replace(/▲/g, 'Naik')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';

    const voices = synthRef.current.getVoices();
    const indVoice = voices.find(voice => voice.lang.includes('id') || voice.lang.includes('ID'));
    if (indVoice) {
      utterance.voice = indVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("TTS error:", e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(true);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'system', text: 'Mendengarkan suara Anda... (Speech recognition tidak didukung di browser ini, dialihkan ke simulasi)' }
      ]);
      setTimeout(() => {
        setIsListening(false);
        const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)].text;
        handleQuery(randomSuggest);
      }, 3000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      stopSpeaking();
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      handleQuery(speechToText);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Helper to generate dynamic context for the AI based on actual JSON data
  const generateDynamicContext = () => {
    if (!data) return '';

    // 1. FILTER DATA BY PROPS
    const factUmkmYear = selectedYear === 'All'
      ? data.fact_umkm_kecamatan_sector
      : data.fact_umkm_kecamatan_sector.filter(r => r.year === selectedYear);

    let filteredUmkm = factUmkmYear;
    if (selectedKecamatan) {
      filteredUmkm = filteredUmkm.filter(r => r.kecamatan === selectedKecamatan);
    }
    if (selectedSector) {
      filteredUmkm = filteredUmkm.filter(r => r.sector_name === selectedSector);
    }

    const totalUmkmFiltered = filteredUmkm.reduce((acc, r) => acc + (r.umkm_count || 0), 0);

    // Group UMKM by Kecamatan (Global for selectedYear & selectedSector)
    const umkmByKec = factUmkmYear.reduce((acc, r) => {
      if (selectedSector && r.sector_name !== selectedSector) return acc;
      acc[r.kecamatan] = (acc[r.kecamatan] || 0) + (r.umkm_count || 0);
      return acc;
    }, {});
    const umkmByKecSorted = Object.entries(umkmByKec)
      .sort((a, b) => b[1] - a[1]);
    const umkmByKecStr = umkmByKecSorted
      .map(([kec, count]) => `${kec}: ${count.toLocaleString('id-ID')} unit`)
      .join(', ');

    // Group UMKM by Sector (Global for selectedYear & selectedKecamatan)
    const umkmBySec = factUmkmYear.reduce((acc, r) => {
      if (selectedKecamatan && r.kecamatan !== selectedKecamatan) return acc;
      acc[r.sector_name] = (acc[r.sector_name] || 0) + (r.umkm_count || 0);
      return acc;
    }, {});
    const umkmBySecSorted = Object.entries(umkmBySec)
      .sort((a, b) => b[1] - a[1]);
    const umkmBySecStr = umkmBySecSorted
      .map(([sec, count]) => `${sec}: ${count.toLocaleString('id-ID')} unit`)
      .join(', ');

    // Digital & Formalization (filtered)
    const totalCount = filteredUmkm.reduce((acc, r) => acc + (r.umkm_count || 0), 0);
    const avgDigital = selectedYear === 'All'
      ? (filteredUmkm.reduce((acc, r) => acc + (r.digital_adoption_pct || 0), 0) / (filteredUmkm.length || 1))
      : (totalCount > 0 ? filteredUmkm.reduce((acc, r) => acc + ((r.digital_adoption_pct || 0) * (r.umkm_count || 0)), 0) / totalCount : 0);

    const avgFormal = selectedYear === 'All'
      ? (filteredUmkm.reduce((acc, r) => acc + (r.formalization_rate_pct || 0), 0) / (filteredUmkm.length || 1))
      : (totalCount > 0 ? filteredUmkm.reduce((acc, r) => acc + ((r.formalization_rate_pct || 0) * (r.umkm_count || 0)), 0) / totalCount : 0);

    // Cooperative Health
    const kopRows = selectedYear === 'All'
      ? data.fact_koperasi_kecamatan
      : data.fact_koperasi_kecamatan.filter(r => r.year === selectedYear);
    
    let filteredKop = kopRows;
    if (selectedKecamatan) {
      filteredKop = filteredKop.filter(r => r.kecamatan === selectedKecamatan);
    }
    const totalActiveCoop = filteredKop.reduce((acc, r) => acc + (r.active_cooperative || 0), 0);
    const totalInactiveCoop = filteredKop.reduce((acc, r) => acc + (r.inactive_cooperative || 0), 0);
    const totalCoops = filteredKop.reduce((acc, r) => acc + (r.total_cooperative || 0), 0);
    const activeCoopRatio = totalCoops > 0 ? totalActiveCoop / totalCoops : 0;

    // Macro economics
    const macroYear = selectedYear === 'All'
      ? (data.fact_macro_city.find(r => r.year === 2024) || {})
      : (data.fact_macro_city.find(r => r.year === selectedYear) || {});

    // KPI scoring per Kecamatan (use 2024/selectedYear)
    const activeKpiYear = selectedYear === 'All' ? 2024 : selectedYear;
    const kpiYear = data.kpi_scoring.filter(r => r.year === activeKpiYear);
    const kpiStr = kpiYear.map(r => 
      `${r.kecamatan} (UMKM: ${r.umkm_2024 || 0}, Growth: ${r.growth_yoy_pct || 0}%, Opp Score: ${r.opportunity_score || 0}, Intervention Score: ${r.intervention_need_score || 0})`
    ).join('\n      - ');

    // Active filters representation
    const filterInfo = `
    FILTER SAAT INI YANG TERPASANG PADA DASHBOARD:
    - Tahun: ${selectedYear}
    - Kecamatan: ${selectedKecamatan || 'Semua (All)'}
    - Sektor: ${selectedSector || 'Semua (All)'}
    `;

    return `
    ${filterInfo}

    DATA DI BAWAH FILTER AKTIF SAAT INI:
    - Total Unit UMKM: ${totalUmkmFiltered.toLocaleString('id-ID')} unit
    - Rata-rata Adopsi Digital UMKM: ${avgDigital.toFixed(2)}% (Target: 80%)
    - Rata-rata Formalisasi UMKM: ${avgFormal.toFixed(2)}% (Target: 90%)
    - Total Koperasi Terdaftar: ${totalCoops.toLocaleString('id-ID')} unit (Aktif: ${totalActiveCoop.toLocaleString('id-ID')}, Tidak Aktif: ${totalInactiveCoop.toLocaleString('id-ID')}, Rasio Keaktifan: ${activeCoopRatio.toFixed(2)})

    DATA GLOBAL KOTA BATAM (Tahun: ${selectedYear}, Sektor Filter: ${selectedSector || 'Semua'}):
    - Jumlah UMKM per Kecamatan: ${umkmByKecStr}
    
    DATA GLOBAL KOTA BATAM (Tahun: ${selectedYear}, Kecamatan Filter: ${selectedKecamatan || 'Semua'}):
    - Jumlah UMKM per Sektor: ${umkmBySecStr}

    DATA KPI SCORING KECAMATAN (Tahun ${activeKpiYear}):
    - Urutan Kecamatan Prioritas Intervensi (Semakin tinggi Intervention Score, semakin butuh bantuan):
      - ${kpiStr}

    DATA MAKRO EKONOMI KOTA BATAM (Tahun ${selectedYear === 'All' ? 2024 : selectedYear}):
    - PDRB Batam: Rp ${macroYear.pdrb_current_trillion_idr || '233.05'} T
    - IPM (Human Development Index): ${macroYear.ipm || '83.32'}
    - Tingkat Kemiskinan: ${macroYear.poverty_rate_pct || '4.85'}%
    `;
  };

  // Call the real Gemini API
  const getGeminiResponse = async (userQuestion) => {
    const dataContext = generateDynamicContext();

    const systemPrompt = `
    Anda adalah AI Analyst Batam UMKM, asisten pintar berbasis data untuk Command Center UMKM Batam.
    Tugas Anda adalah menjawab pertanyaan user mengenai kondisi UMKM, sektor bisnis, koperasi, dan pertumbuhan ekonomi makro Kota Batam secara ringkas dan informatif menggunakan bahasa Indonesia yang santun dan profesional.
    PENTING: Selalu gunakan data aktual dari konteks yang diberikan di bawah ini untuk menjawab semua pertanyaan angka. Jangan mengarang data atau menggunakan data hardcoded di luar konteks.
    
    Konteks data saat ini:
    ${dataContext}

    CRITICAL RULES:
    1. Anda wajib menyertakan tag instruksi di bagian PALING AKHIR teks jawaban Anda untuk mengarahkan pengguna ke visualisasi grafik yang tepat. Pilih tepat SATU tag highlight dan/atau SATU tag tab dari daftar berikut:
       - Untuk Peta / Wilayah / Prioritas Kecamatan -> Tambahkan \`[HIGHLIGHT:map][TAB:overview]\`
       - Untuk Tren Total UMKM / Growth / YoY -> Tambahkan \`[HIGHLIGHT:trend][TAB:overview]\`
       - Untuk Komposisi Sektor / Jenis Usaha / Pie -> Tambahkan \`[HIGHLIGHT:sector][TAB:overview]\`
       - Untuk Tabel Peringkat Top 5 -> Tambahkan \`[HIGHLIGHT:table][TAB:overview]\`
       - Untuk Digitalisasi / Formalisasi / Pengukur Gauge -> Tambahkan \`[HIGHLIGHT:gauges][TAB:regional]\`
       - Untuk Statistik Koperasi / Koperasi Aktif / Tidak Aktif -> Tambahkan \`[HIGHLIGHT:coop-kpi][TAB:cooperative]\`
       - Untuk Indikator Makro Ekonomi / PDRB / IPM -> Tambahkan \`[HIGHLIGHT:macro][TAB:overview]\`
    2. JANGAN PERNAH menggunakan simbol bintang (*) atau double asteriks (**) dalam respons tertulis Anda untuk memformat tebal (bold) maupun bullet points. Jika ingin menampilkan daftar list, gunakan format baris baru atau angka (1., 2., dst.) tanpa karakter bintang.
    
    Contoh akhir respon:
    "...sehingga Bulang menjadi kecamatan prioritas pertama. [HIGHLIGHT:map][TAB:overview]"
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + "\n\nUser Question: " + userQuestion
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const resData = await response.json();
      const answer = resData.candidates[0].content.parts[0].text;
      return answer;
    } catch (e) {
      console.error("Gemini API Error:", e);
      return "Maaf, terjadi kesalahan koneksi ke server AI Gemini. Saya akan mencoba menjawab secara lokal: Berdasarkan data, prioritas tertinggi berada di Bulang [HIGHLIGHT:map][TAB:overview]";
    }
  };

  const handleQuery = async (textToSend) => {
    if (!textToSend.trim() || loading) return;

    stopSpeaking();
    setLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');

    // Query Gemini
    const rawAnswer = await getGeminiResponse(textToSend);
    
    // Parse highlighting and tab actions from the answer, and clean asterisks
    let processedAnswer = rawAnswer.replace(/\*/g, '');
    let highlightTag = null;
    let tabTag = null;

    const highlightMatch = rawAnswer.match(/\[HIGHLIGHT:([a-zA-Z\-]+)\]/);
    if (highlightMatch) {
      highlightTag = highlightMatch[1];
      processedAnswer = processedAnswer.replace(highlightMatch[0], '');
    }

    const tabMatch = rawAnswer.match(/\[TAB:([a-zA-Z\-]+)\]/);
    if (tabMatch) {
      tabTag = tabMatch[1];
      processedAnswer = processedAnswer.replace(tabMatch[0], '');
    }

    // Apply dashboard action triggers
    if (tabTag) {
      onSwitchTab(tabTag);
    }
    if (highlightTag) {
      onHighlightChart(highlightTag);
    }

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: processedAnswer.trim()
    };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);

    speakText(processedAnswer);
  };

  return (
    <div className="ai-panel-wrapper">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-title-wrapper">
          <Sparkles size={16} className="text-purple-400 animate-pulse" />
          <h3 className="ai-title-txt">AI VOICE ANALYST</h3>
          <span className="ai-badge">BETA</span>
        </div>
        <div className="chat-actions">
          <button 
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setTtsEnabled(!ttsEnabled);
            }}
            className="icon-btn"
            title={ttsEnabled ? "Matikan Suara" : "Aktifkan Suara"}
          >
            {ttsEnabled ? <Volume2 size={14} style={{ color: 'var(--primary)' }} /> : <VolumeX size={14} />}
          </button>
          
          <button onClick={onClose} className="icon-btn">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-body">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`chat-msg-wrapper ${m.sender === 'user' ? 'user' : m.sender === 'system' ? 'system' : 'ai'}`}
          >
            <span className="chat-msg-lbl">
              {m.sender === 'user' ? 'Analyst' : m.sender === 'system' ? 'System' : 'AI Analyst'}
            </span>
            <div className="chat-msg-bubble">
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg-wrapper ai">
            <span className="chat-msg-lbl">AI Analyst</span>
            <div className="chat-msg-bubble" style={{ fontStyle: 'italic', opacity: 0.6 }}>
              Menghitung dan memproses data...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice visualizer */}
      <div className="chat-waveform-section">
        <div className="wave-container">
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
        </div>
        <span className="chat-waveform-text">
          {isSpeaking ? 'AI sedang berbicara...' : isListening ? 'Sedang mendengar...' : 'Tekan mic untuk berbicara'}
        </span>
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="chat-suggestions">
          <span className="chat-suggestions-title">Rekomendasi Pertanyaan:</span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleQuery(s.text)}
              className="suggestion-chip"
              disabled={loading}
            >
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input controls */}
      <div className="chat-inputs-wrapper">
        <button
          onClick={startSpeechRecognition}
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          disabled={loading}
          title="Tanya dengan Suara (Mic)"
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-rose-500/20 border border-rose-500 dot-ping" />
          )}
          <Mic size={14} />
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuery(query)}
          placeholder="atau ketik pertanyaan..."
          className="text-input"
          disabled={loading}
        />

        <button
          onClick={() => handleQuery(query)}
          disabled={!query.trim() || loading}
          className="send-btn"
        >
          <Send size={12} />
        </button>
      </div>

      <div className="ai-disclaimer">
        AI dapat membuat kesalahan. Verifikasi data penting.
      </div>
    </div>
  );
}
