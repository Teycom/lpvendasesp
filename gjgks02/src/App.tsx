import React, { useEffect, useState } from 'react';
import { AlertCircle, X, Play, CheckCircle2, Clock, Heart } from 'lucide-react';
import { CONFIG } from './config';

function App() {
  const [showCTA, setShowCTA] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(20);
  const [showExitModal, setShowExitModal] = useState(false);
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [socialProofName, setSocialProofName] = useState('');
  const [viewerCount, setViewerCount] = useState(439);
  const [videoStarted, setVideoStarted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [usedNames, setUsedNames] = useState(new Set());
  const [userCity, setUserCity] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [hasSeenDelay, setHasSeenDelay] = useState(false);

  const latinNames = [
    "Guadalupe", "María", "Valentina", "Isabella", "Camila",
    "Sofia", "Ana Paula", "Luciana", "Carolina", "Fernanda",
    "Mariana", "Daniela", "Gabriela", "Victoria", "Andrea",
    "Alejandra", "Patricia", "Rosa", "Carmen", "Laura"
  ];

  useEffect(() => {
    // Check if user has already seen the delay content
    const hasSeenDelayStorage = localStorage.getItem('hasSeenDelay');
    if (hasSeenDelayStorage === 'true') {
      setHasSeenDelay(true);
      setShowCTA(true);
      setVideoStarted(true);
      setShowPlayButton(false);
    }

    // Set static closing time based on user's local time
    const now = new Date();
    const staticClosingTime = now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    setClosingTime(staticClosingTime);

    // Get user's location
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setUserCity(data.city || 'su ciudad');
      })
      .catch(() => setUserCity('su ciudad'));
  }, []);

  const getRandomUnusedName = () => {
    const availableNames = latinNames.filter(name => !usedNames.has(name));
    if (availableNames.length === 0) {
      setUsedNames(new Set());
      return latinNames[Math.floor(Math.random() * latinNames.length)];
    }
    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    setUsedNames(new Set([...usedNames, name]));
    return name;
  };

  useEffect(() => {
    // Slower viewer count updates (every 3 seconds)
    const viewerTimer = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) + 1;
        const decrease = Math.random() < 0.3;
        return decrease ? prev - Math.min(3, change) : prev + change;
      });
    }, 3000);

    // Social proof rotation - only when CTA is shown
    let socialProofTimer: NodeJS.Timeout;
    if (showCTA) {
      socialProofTimer = setInterval(() => {
        const newName = getRandomUnusedName();
        setSocialProofName(newName);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }, 3000);
    }

    // Slower FOMO countdown (every 2 seconds)
    const fomoTimer = setInterval(() => {
      setRemainingSpots((prev) => {
        if (prev <= 1) return 1;
        return prev - 1;
      });
    }, 2000);

    // Exit intent and back button detection - only after delay
    const handleExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && showCTA) {
        setShowExitModal(true);
      }
    };

    const handlePopState = () => {
      if (showCTA) {
        setShowExitModal(true);
        history.pushState(null, '', window.location.pathname);
      }
    };

    if (showCTA) {
      history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('mouseleave', handleExit);
    }

    return () => {
      clearInterval(viewerTimer);
      if (socialProofTimer) clearInterval(socialProofTimer);
      clearInterval(fomoTimer);
      if (showCTA) {
        document.removeEventListener('mouseleave', handleExit);
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [showCTA]);

  const handlePlayClick = () => {
    setVideoStarted(true);
    setShowPlayButton(false);
    setTimeout(() => {
      setShowCTA(true);
      setHasSeenDelay(true);
      localStorage.setItem('hasSeenDelay', 'true');
    }, CONFIG.CONTENT_DELAY);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5585981173668', '_blank');
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Closing Time Banner - Always visible */}
      <div className="sticky top-0 z-50 bg-red-600 text-white py-2 px-4 text-center font-medium shadow-lg">
        <Clock className="inline-block mr-2 h-4 w-4" />
        Este sitio se cerrará hoy a las {closingTime}
      </div>

      {/* Background with reduced opacity and eager loading */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&q=80')",
          opacity: videoStarted ? 0.1 : 0.3,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Video overlay with smooth transition */}
      {videoStarted && (
        <div 
          className="fixed inset-0 bg-black z-10"
          style={{
            opacity: 0.95,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-1000 ${
            videoStarted ? 'text-white' : 'text-red-600'
          } bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent`}>
            Descubra Como Curar la Selectividad Alimentaria de Tu Hijo(a) en 4 días
          </h1>
          <p className="text-lg bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent font-semibold transition-colors duration-1000">
            Cómo superar definitivamente el miedo a los alimentos nuevos
          </p>
        </div>

        {/* Live Viewer Count */}
        <div className="text-center mb-4">
          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full text-sm shadow-lg">
            {viewerCount} mamás viendo ahora en {userCity}
          </span>
        </div>

        {/* Social Proof Notifications - Only show after delay */}
        {showCTA && socialProofName && showNotification && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/90 shadow-lg rounded-lg p-3 animate-slide-in-right transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {socialProofName} compró ahora ✨
                  </p>
                  <p className="text-xs text-gray-500">Hace unos momentos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VSL Player Container */}
        <div className="relative">
          <div 
            id="vturb-player"
            className={`aspect-video bg-black/10 rounded-xl shadow-2xl border-2 border-pink-200/30 mb-8 transition-all duration-700 ${
              videoStarted ? 'scale-100 transform-none' : 'hover:scale-[1.02]'
            }`}
          >
            {showPlayButton && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-500/20 to-red-500/20 hover:from-pink-500/30 hover:to-red-500/30 transition-all duration-300 rounded-xl"
              >
                <Play size={64} className="text-white animate-pulse" />
              </button>
            )}
            {/* VTurb script goes here */}
            <div className="flex items-center justify-center h-full text-gray-400">
              [VTurb Player Placeholder]
            </div>
          </div>
        </div>

        {/* CTA Section - Only show after delay */}
        {showCTA && (
          <div className="text-center animate-slide-up">
            <button
              onClick={handleWhatsApp}
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold py-6 px-10 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-attention w-full max-w-2xl"
            >
              Quiero curar a mi hijo
              <div className="text-sm mt-1 text-green-100">
                Solo resta {remainingSpots} {remainingSpots === 1 ? 'vacante disponible' : 'vacantes disponibles'}
              </div>
            </button>
          </div>
        )}

        {/* Footer Links */}
        <div className="fixed bottom-2 left-0 right-0 text-center z-50">
          <button 
            onClick={() => setShowPrivacyPolicy(true)}
            className={`mx-2 text-sm ${videoStarted ? 'text-gray-400' : 'text-gray-600'} hover:underline`}
          >
            Política de Privacidad
          </button>
          <button 
            onClick={() => setShowTerms(true)}
            className={`mx-2 text-sm ${videoStarted ? 'text-gray-400' : 'text-gray-600'} hover:underline`}
          >
            Términos de Uso
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto relative">
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Política de Privacidad</h2>
            <div className="prose prose-sm max-h-[70vh] overflow-y-auto">
              <h3>1. Recopilación de Información</h3>
              <p>Recopilamos información personal que usted nos proporciona directamente cuando utiliza nuestros servicios, incluyendo:</p>
              <ul>
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Información de pago</li>
              </ul>

              <h3>2. Uso de la Información</h3>
              <p>Utilizamos la información recopilada para:</p>
              <ul>
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Procesar sus transacciones</li>
                <li>Enviar comunicaciones relacionadas con el servicio</li>
                <li>Mejorar nuestros servicios</li>
              </ul>

              <h3>3. Protección de Datos</h3>
              <p>Implementamos medidas de seguridad para proteger su información personal, incluyendo:</p>
              <ul>
                <li>Encriptación de datos</li>
                <li>Firewalls y sistemas de seguridad</li>
                <li>Acceso restringido a la información personal</li>
              </ul>

              <h3>4. Compartir Información</h3>
              <p>No vendemos ni compartimos su información personal con terceros, excepto:</p>
              <ul>
                <li>Con su consentimiento explícito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Para proteger nuestros derechos y propiedad</li>
              </ul>

              <h3>5. Sus Derechos</h3>
              <p>Usted tiene derecho a:</p>
              <ul>
                <li>Acceder a su información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
              </ul>

              <h3>6. Cookies y Tecnologías Similares</h3>
              <p>Utilizamos cookies y tecnologías similares para:</p>
              <ul>
                <li>Mejorar la experiencia del usuario</li>
                <li>Analizar el uso del sitio web</li>
                <li>Personalizar el contenido</li>
              </ul>

              <h3>7. Cambios en la Política</h3>
              <p>Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.</p>

              <h3>8. Contacto</h3>
              <p>Si tiene preguntas sobre esta política, contáctenos a través de los canales proporcionados en nuestro sitio web.</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto relative">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Términos de Uso</h2>
            <div className="prose prose-sm max-h-[70vh] overflow-y-auto">
              <h3>1. Aceptación de los Términos</h3>
              <p>Al acceder y utilizar este sitio web, usted acepta estos términos y condiciones en su totalidad.</p>

              <h3>2. Descripción del Servicio</h3>
              <p>Proporcionamos servicios de consultoría y asesoramiento en nutrición infantil, específicamente enfocados en la selectividad alimentaria.</p>

              <h3>3. Registro y Cuenta</h3>
              <p>Para acceder a ciertos servicios, debe:</p>
              <ul>
                <li>Proporcionar información precisa y completa</li>
                <li>Mantener la confidencialidad de su cuenta</li>
                <li>Notificar cualquier uso no autorizado</li>
              </ul>

              <h3>4. Pagos y Reembolsos</h3>
              <p>Nuestras políticas de pago incluyen:</p>
              <ul>
                <li>Precios en la moneda local especificada</li>
                <li>Procesamiento seguro de pagos</li>
                <li>Política de reembolso de 30 días</li>
              </ul>

              <h3>5. Propiedad Intelectual</h3>
              <p>Todo el contenido del sitio web está protegido por derechos de autor y otras leyes de propiedad intelectual.</p>

              <h3>6. Limitación de Responsabilidad</h3>
              <p>No nos hacemos responsables de:</p>
              <ul>
                <li>Daños indirectos o consecuentes</li>
                <li>Pérdida de datos o ganancias</li>
                <li>Interrupciones del servicio</li>
              </ul>

              <h3>7. Modificaciones del Servicio</h3>
              <p>Nos reservamos el derecho de:</p>
              <ul>
                <li>Modificar o discontinuar el servicio</li>
                <li>Cambiar precios y características</li>
                <li>Actualizar estos términos</li>
              </ul>

              <h3>8. Terminación</h3>
              <p>Podemos terminar o suspender el acceso a nuestros servicios por:</p>
              <ul>
                <li>Violación de los términos</li>
                <li>Actividad fraudulenta</li>
                <li>Comportamiento abusivo</li>
              </ul>

              <h3>9. Ley Aplicable</h3>
              <p>Estos términos se rigen por las leyes del país donde operamos, sin considerar conflictos de principios legales.</p>

              <h3>10. Contacto</h3>
              <p>Para preguntas sobre estos términos, contáctenos a través de los canales proporcionados en el sitio web.</p>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal - Only show after delay */}
      {showExitModal && showCTA && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 relative">
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="text-pink-500 w-16 h-16 animate-pulse" />
                <div className="absolute -top-1 -right-1">
                  <Heart className="text-red-500 w-6 h-6" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
              ¡Mamá, no te vayas todavía!
            </h3>
            
            <p className="text-gray-600 mb-6 text-center">
              Entendemos tu preocupación por la alimentación de tu hijo. ¡Nuestra especialista está disponible para resolver tus dudas!
            </p>
            
            <button
              onClick={handleWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-colors"
            >
              Hablar con Especialista
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;