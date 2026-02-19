
import React, { useState, useEffect, useCallback } from 'react';
import { User, Booking, AppScreen, Racket, Partner } from './types';
import { MOCK_PARTNERS, RACKETS, TABLES } from './constants';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  
  // App settings state
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoRatingUpdate: true
  });

  // Booking flow state
  const [bookingInProgress, setBookingInProgress] = useState<Partial<Booking>>({
    rackets: []
  });
  
  // App-wide state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState([
    { id: 'c1', number: '**** **** **** 4242', expiry: '12/26', type: 'VISA' }
  ]);

  // Helper to get active booking
  const activeBooking = bookings.find(b => b.id === activeBookingId);

  // Handle navigation
  const navigateTo = useCallback((screen: AppScreen) => {
    setCurrentScreen(screen);
  }, []);

  // Simplified Auth
  const handleLogin = (name: string, phone: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      rttfRating: 450,
      balance: 1500,
      bonusPoints: 100
    };
    setUser(newUser);
    navigateTo(AppScreen.DASHBOARD);
  };

  const startBooking = () => {
    setBookingInProgress({
      id: Math.random().toString(36).substr(2, 9),
      rackets: [],
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
    navigateTo(AppScreen.BOOKING_DATE);
  };

  const confirmPayment = () => {
    const finalBooking = {
      ...bookingInProgress,
      status: 'active' as const,
      totalPrice: (bookingInProgress.rackets?.reduce((sum, r) => sum + r.price, 0) || 0) + 500, 
    } as Booking;

    setBookings(prev => [...prev, finalBooking]);
    setActiveBookingId(finalBooking.id);
    navigateTo(AppScreen.ACTIVE_SESSION);
  };

  const endSession = () => {
    if (activeBookingId) {
      setBookings(prev => prev.map(b => b.id === activeBookingId ? { ...b, status: 'completed' as const } : b));
      setActiveBookingId(null);
      navigateTo(AppScreen.DASHBOARD);
    }
  };

  const addNewCard = () => {
    const lastFour = Math.floor(1000 + Math.random() * 9000);
    setSavedCards(prev => [
      ...prev, 
      { id: Date.now().toString(), number: `**** **** **** ${lastFour}`, expiry: '08/28', type: 'MASTERCARD' }
    ]);
    alert('Карта успешно добавлена!');
  };

  // Views rendering
  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.ONBOARDING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-[#3362B5] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-[#3362B5]/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><path d="M12 12h.01"/></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-[#1B407F] mb-4 tracking-tight">Tenergy</h1>
            <p className="text-gray-500 text-lg mb-12">Играй. Бронируй. Развивайся.</p>
            <button 
              onClick={() => navigateTo(AppScreen.AUTH)}
              className="w-full py-5 bg-[#3362B5] text-white rounded-2xl font-bold text-lg mb-4 active:scale-[0.98] transition-all shadow-lg"
            >
              Войти
            </button>
            <p className="text-sm text-gray-400">Нужен номер телефона и имя</p>
          </div>
        );

      case AppScreen.AUTH:
        return (
          <div className="px-8 pt-20">
            <h2 className="text-3xl font-bold mb-8 text-[#1B407F]">Регистрация</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Имя</label>
                <input id="name-input" type="text" placeholder="Алексей" className="w-full p-4 mt-2 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3362B5] transition-all outline-none text-lg" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Телефон</label>
                <input id="phone-input" type="tel" placeholder="+7 (999) 000-00-00" className="w-full p-4 mt-2 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3362B5] transition-all outline-none text-lg" />
              </div>
              <button onClick={() => {
                  const name = (document.getElementById('name-input') as HTMLInputElement).value || 'Гость';
                  const phone = (document.getElementById('phone-input') as HTMLInputElement).value || '79990000000';
                  handleLogin(name, phone);
                }}
                className="w-full py-5 bg-[#3362B5] text-white rounded-2xl font-bold text-lg mt-8 active:scale-[0.98] transition-all"
              >
                Продолжить
              </button>
            </div>
          </div>
        );

      case AppScreen.DASHBOARD:
        return (
          <div className="px-6 space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-400 text-sm">Привет,</p>
                <h2 className="text-2xl font-bold text-[#1B407F]">{user?.name}</h2>
              </div>
              <div className="bg-[#3362B5]/10 px-4 py-2 rounded-xl">
                <p className="text-[10px] text-[#3362B5] font-bold uppercase tracking-wider">Рейтинг RTTF</p>
                <p className="text-lg font-bold text-[#1B407F]">{user?.rttfRating}</p>
              </div>
            </div>

            {activeBookingId ? (
              <div onClick={() => navigateTo(AppScreen.ACTIVE_SESSION)} className="bg-[#E03832] rounded-3xl p-6 text-white shadow-xl shadow-red-200 flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform">
                <div><p className="text-sm opacity-80 font-medium">Активная бронь</p><p className="text-xl font-bold">Стол №{activeBooking?.tableId}</p></div>
                <div className="bg-white/20 p-3 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
              </div>
            ) : (
              <div onClick={startBooking} className="bg-[#3362B5] rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Забронировать стол</h3>
                  <p className="opacity-80 text-sm max-w-[200px]">Выбери удобное время и ракетки за пару кликов</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><path d="M12 12h.01"/></svg></div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <QuickAction onClick={() => navigateTo(AppScreen.PARTNERS)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3362B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} title="Найти партнера" subtitle="По рейтингу" />
              <QuickAction onClick={() => navigateTo(AppScreen.HISTORY)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3362B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>} title="История игр" subtitle="Статистика" />
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden">
              <h4 className="font-bold text-[#1B407F] mb-4">Предложения для вас</h4>
              {/* Added -mx-6 and px-6 to make it full width scrollable */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 snap-x snap-mandatory">
                <PromoCard onClick={() => alert('Акция активирована!')} color="#3362B5" text="Аренда второй ракетки бесплатно в ПН" />
                <PromoCard onClick={() => alert('Вы записаны на турнир!')} color="#E03832" text="Турнир Tenergy Open: 24 Сентября" />
                <PromoCard onClick={() => alert('Скидка применена!')} color="#1B407F" text="Скидка 20% на утренние часы (08:00 - 11:00)" />
                <PromoCard onClick={() => alert('Ссылка для приглашения скопирована!')} color="#10B981" text="Приведи друга и получи 200 бонусов" />
              </div>
            </div>
          </div>
        );

      case AppScreen.PROFILE:
        return (
          <div className="px-6 animate-fadeIn space-y-8 pb-10">
            <div className="flex flex-col items-center pt-4">
              <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-[#3362B5] to-[#1B407F] p-1 mb-4">
                <div className="w-full h-full rounded-[28px] bg-white flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#3362B5]">{user?.name[0]}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#1B407F] mb-1">{user?.name}</h2>
              <p className="text-gray-400 font-medium">{user?.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Рейтинг</p>
                <p className="text-2xl font-bold text-[#3362B5]">{user?.rttfRating}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Бонусы</p>
                <p className="text-2xl font-bold text-[#E03832]">{user?.bonusPoints} ⭐</p>
              </div>
            </div>

            <div className="space-y-2">
              <ProfileMenuItem onClick={() => navigateTo(AppScreen.MY_CARDS)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>} label="Мои карты" />
              <ProfileMenuItem onClick={() => navigateTo(AppScreen.SETTINGS)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>} label="Настройки" />
              <ProfileMenuItem onClick={() => navigateTo(AppScreen.SUPPORT)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} label="Поддержка" />
              <button onClick={() => setUser(null) || navigateTo(AppScreen.ONBOARDING)} className="w-full p-5 flex items-center gap-4 text-red-500 font-bold active:bg-red-50 rounded-3xl transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Выйти</button>
            </div>
          </div>
        );

      case AppScreen.MY_CARDS:
        return (
          <div className="px-6 animate-fadeIn space-y-6">
            <div className="space-y-4">
              {savedCards.map(card => (
                <div key={card.id} className="w-full bg-gradient-to-br from-[#1B407F] to-[#3362B5] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden active:scale-[0.98] transition-transform">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-10 h-6 bg-yellow-400/80 rounded"></div>
                    <h4 className="font-bold tracking-widest text-sm">{card.type}</h4>
                  </div>
                  <p className="text-xl tracking-[0.2em] font-medium mb-6">{card.number}</p>
                  <div className="flex justify-between items-end">
                    <div><p className="text-[8px] opacity-60 uppercase">Card Holder</p><p className="font-bold uppercase tracking-wider text-xs">{user?.name}</p></div>
                    <p className="font-bold text-xs">{card.expiry}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addNewCard} className="w-full py-5 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center gap-3 text-gray-400 font-bold hover:bg-gray-50 active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Добавить карту
            </button>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><h4 className="font-bold text-[#1B407F] mb-4">Безопасность</h4><p className="text-sm text-gray-500 leading-relaxed">Данные ваших карт зашифрованы и защищены по стандарту PCI DSS. Мы не храним CVV коды на наших серверах.</p></div>
          </div>
        );

      case AppScreen.SETTINGS:
        return (
          <div className="px-6 animate-fadeIn space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Общие</h3>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <ToggleItem label="Уведомления" active={settings.notifications} onToggle={() => setSettings(s => ({ ...s, notifications: !s.notifications }))} />
              <ToggleItem label="Тёмная тема" active={settings.darkMode} onToggle={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))} />
              <ToggleItem label="Авто-рейтинг RTTF" active={settings.autoRatingUpdate} onToggle={() => setSettings(s => ({ ...s, autoRatingUpdate: !s.autoRatingUpdate }))} />
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mt-6 mb-2">Данные</h3>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <button className="w-full p-5 flex justify-between items-center border-b border-gray-50 active:bg-gray-50 transition-colors"><span className="font-bold text-[#1B407F]">Изменить имя</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
              <button className="w-full p-5 flex justify-between items-center active:bg-gray-50 transition-colors"><span className="font-bold text-[#1B407F]">Привязать E-mail</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
          </div>
        );

      case AppScreen.SUPPORT:
        return (
          <div className="px-6 animate-fadeIn space-y-6">
            <div className="bg-[#3362B5]/5 p-8 rounded-[40px] text-center">
               <div className="w-20 h-20 bg-[#3362B5] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
               <h3 className="text-xl font-bold text-[#1B407F] mb-2">Мы на связи 24/7</h3>
               <p className="text-gray-500 text-sm">Любой вопрос по бронированию или оборудованию — пишите нам!</p>
            </div>
            <div className="space-y-3">
              <SupportOption onClick={() => window.open('https://t.me/tenergy_club', '_blank')} color="#0088CC" label="Чат в Telegram" />
              <SupportOption onClick={() => window.open('https://wa.me/79990000000', '_blank')} color="#25D366" label="Написать в WhatsApp" />
              <SupportOption onClick={() => window.open('tel:+79990000000', '_self')} color="#1B407F" label="Позвонить администратору" />
            </div>
          </div>
        );

      case AppScreen.BOOKING_DATE:
        return (
          <div className="px-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-[#1B407F]">Выбор даты</h2>
            <div className="grid grid-cols-7 gap-2 mb-10">
              {[...Array(14)].map((_, i) => {
                const date = new Date(); date.setDate(date.getDate() + i);
                const isSelected = bookingInProgress.date === date.toISOString().split('T')[0];
                return (
                  <div key={i} onClick={() => setBookingInProgress(p => ({ ...p, date: date.toISOString().split('T')[0] }))}
                    className={`flex flex-col items-center py-3 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-[#3362B5] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    <span className="text-[10px] uppercase font-bold mb-1">{date.toLocaleDateString('ru-RU', { weekday: 'short' })}</span>
                    <span className="text-lg font-bold">{date.getDate()}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigateTo(AppScreen.BOOKING_TIME)} className="w-full py-5 bg-[#3362B5] text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all shadow-lg">Далее</button>
          </div>
        );

      case AppScreen.BOOKING_TIME:
        return (
          <div className="px-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-2 text-[#1B407F]">Выберите время</h2>
            <p className="text-gray-400 text-sm mb-6">Длительность сессии: 60 мин</p>
            <div className="space-y-6 mb-10">
              {TABLES.map(table => (
                <div key={table.id}><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">{table.name}</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map(slot => {
                      const isSelected = bookingInProgress.tableId === table.id && bookingInProgress.timeSlot === slot;
                      const isBooked = Math.random() > 0.8; 
                      return (
                        <button key={slot} disabled={isBooked} onClick={() => setBookingInProgress(p => ({ ...p, tableId: table.id, timeSlot: slot }))}
                          className={`flex-shrink-0 px-6 py-4 rounded-2xl font-bold transition-all border-2 ${isBooked ? 'bg-gray-100 border-transparent text-gray-300' : isSelected ? 'bg-[#E03832] border-[#E03832] text-white shadow-lg shadow-red-200' : 'bg-white border-gray-100 text-[#1B407F] hover:border-[#3362B5]'}`}
                        >{slot}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button disabled={!bookingInProgress.tableId || !bookingInProgress.timeSlot} onClick={() => navigateTo(AppScreen.BOOKING_RACKETS)} className={`w-full py-5 text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all ${!bookingInProgress.tableId || !bookingInProgress.timeSlot ? 'bg-gray-200' : 'bg-[#3362B5] shadow-lg'}`}>Выбрать ракетки</button>
          </div>
        );

      case AppScreen.BOOKING_RACKETS:
        return (
          <div className="px-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-2 text-[#1B407F]">Аренда ракеток</h2>
            <p className="text-gray-400 text-sm mb-8">Премиальное оборудование Tenergy</p>
            <div className="space-y-4 mb-10">
              {RACKETS.map(racket => {
                const isSelected = bookingInProgress.rackets?.some(r => r.id === racket.id);
                return (
                  <div key={racket.id} onClick={() => {
                      setBookingInProgress(prev => {
                        const exists = prev.rackets?.some(r => r.id === racket.id);
                        return exists ? { ...prev, rackets: prev.rackets?.filter(r => r.id !== racket.id) } : { ...prev, rackets: [...(prev.rackets || []), racket] };
                      });
                    }}
                    className={`p-4 rounded-3xl flex items-center gap-4 transition-all cursor-pointer border-2 ${isSelected ? 'border-[#3362B5] bg-[#3362B5]/5' : 'border-gray-100 bg-white'}`}
                  >
                    <img src={racket.image} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1"><h4 className="font-bold text-[#1B407F]">{racket.name}</h4><p className="text-xs text-gray-400 font-medium uppercase">{racket.type} • {racket.rating} rating</p></div>
                    <div className="text-right"><p className="font-bold text-[#3362B5]">{racket.price} ₽</p><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${isSelected ? 'bg-[#3362B5] border-[#3362B5]' : 'border-gray-200'}`}>{isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}</div></div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigateTo(AppScreen.BOOKING_SUMMARY)} className="w-full py-5 bg-[#3362B5] text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all shadow-lg">К итогам</button>
          </div>
        );

      case AppScreen.BOOKING_SUMMARY:
        const totalPrice = 500 + (bookingInProgress.rackets?.reduce((s, r) => s + r.price, 0) || 0);
        return (
          <div className="px-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-8 text-[#1B407F]">Ваша бронь</h2>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 mb-10">
              <div className="flex justify-between items-center"><p className="text-gray-400 font-medium">Стол</p><p className="font-bold text-[#1B407F]">№{bookingInProgress.tableId}</p></div>
              <div className="flex justify-between items-center"><p className="text-gray-400 font-medium">Дата и время</p><p className="font-bold text-[#1B407F]">{bookingInProgress.date}, {bookingInProgress.timeSlot}</p></div>
              <div className="border-t border-gray-100 pt-6"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Детализация</p><div className="flex justify-between text-sm mb-2"><p>Аренда стола (1ч)</p><p className="font-bold">500 ₽</p></div>
                {bookingInProgress.rackets?.map(r => (<div key={r.id} className="flex justify-between text-sm mb-2"><p>{r.name}</p><p className="font-bold">{r.price} ₽</p></div>))}
              </div>
              <div className="border-t border-gray-100 pt-6 flex justify-between items-center"><p className="text-lg font-bold text-[#1B407F]">Итого</p><p className="text-2xl font-bold text-[#E03832]">{totalPrice} ₽</p></div>
            </div>
            <button onClick={() => navigateTo(AppScreen.PAYMENT)} className="w-full py-5 bg-[#E03832] text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all shadow-xl shadow-red-200">Оплатить</button>
          </div>
        );

      case AppScreen.PAYMENT:
        return (
          <div className="px-6 animate-fadeIn flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-sm bg-gradient-to-br from-[#1B407F] to-[#3362B5] rounded-3xl p-8 text-white shadow-2xl mb-12 relative overflow-hidden">
               <div className="flex justify-between items-start mb-12"><div className="w-12 h-8 bg-yellow-400/80 rounded-lg"></div><h4 className="font-bold tracking-widest">VISA</h4></div>
               <p className="text-2xl tracking-[0.2em] font-medium mb-8">**** **** **** 4242</p>
               <div className="flex justify-between items-end"><div><p className="text-[10px] opacity-60 uppercase mb-1">Card Holder</p><p className="font-bold uppercase tracking-wider">{user?.name}</p></div><p className="font-bold">12/26</p></div>
            </div>
            <button onClick={confirmPayment} className="w-full py-5 bg-[#3362B5] text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all shadow-lg">Подтвердить платеж</button>
          </div>
        );

      case AppScreen.ACTIVE_SESSION:
        return (
          <div className="px-6 space-y-10 animate-fadeIn">
            <div className="text-center pt-4"><h2 className="text-3xl font-bold text-[#1B407F] mb-2">Приятной игры!</h2><p className="text-[#3362B5] font-bold">Стол №{activeBooking?.tableId} • 60 мин</p></div>
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col items-center">
              <div className="mb-6 p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TENERGY-ENTRY-${activeBookingId}`} className="w-48 h-48" alt="QR Code" /></div>
              <button onClick={() => alert('Клуб открыт!')} className="w-full py-5 bg-[#3362B5] text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">Открыть клуб</button>
            </div>
            <div className="flex flex-col items-center"><div className="text-5xl font-mono font-bold text-[#E03832]">59:42</div><p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">До конца сессии</p></div>
            <button onClick={endSession} className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">Завершить раньше</button>
          </div>
        );

      case AppScreen.PARTNERS:
        return (
          <div className="px-6 animate-fadeIn space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100"><h3 className="font-bold text-[#1B407F] mb-1">Найди соперника</h3><p className="text-xs text-gray-400">Система подберет игрока твоего уровня</p></div>
            <div className="space-y-4">
              {MOCK_PARTNERS.map(partner => (
                <div key={partner.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm active:bg-gray-50 transition-colors">
                  <img src={partner.avatar} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1"><h4 className="font-bold text-[#1B407F]">{partner.name}</h4><p className="text-xs text-gray-400 font-medium">RTTF: {partner.rating}</p></div>
                  <button onClick={() => alert(`Вызов отправлен ${partner.name}`)} className="bg-[#3362B5] text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">Вызвать</button>
                </div>
              ))}
            </div>
          </div>
        );

      case AppScreen.HISTORY:
        return (
          <div className="px-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-[#1B407F]">История игр</h2>
            {bookings.length > 0 ? (
              <div className="space-y-4">{bookings.map(b => (<div key={b.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm"><div><p className="font-bold text-[#1B407F]">Стол №{b.tableId}</p><p className="text-xs text-gray-400 font-medium">{b.date}</p></div><div className="text-right font-bold text-[#3362B5]">{b.totalPrice} ₽</div></div>))}</div>
            ) : (<div className="flex flex-col items-center justify-center pt-20 text-gray-400"><p>История пуста</p></div>)}
          </div>
        );

      default: return <div className="p-10 text-center">Экран в разработке</div>;
    }
  };

  const getScreenProps = () => {
    switch (currentScreen) {
      case AppScreen.DASHBOARD: return { title: 'Tenergy' };
      case AppScreen.MY_CARDS: return { title: 'Мои карты', onBack: () => navigateTo(AppScreen.PROFILE) };
      case AppScreen.SETTINGS: return { title: 'Настройки', onBack: () => navigateTo(AppScreen.PROFILE) };
      case AppScreen.SUPPORT: return { title: 'Поддержка', onBack: () => navigateTo(AppScreen.PROFILE) };
      case AppScreen.BOOKING_DATE: return { title: 'Бронь', onBack: () => navigateTo(AppScreen.DASHBOARD) };
      case AppScreen.BOOKING_TIME: return { title: 'Время', onBack: () => navigateTo(AppScreen.BOOKING_DATE) };
      case AppScreen.BOOKING_RACKETS: return { title: 'Ракетки', onBack: () => navigateTo(AppScreen.BOOKING_TIME) };
      case AppScreen.BOOKING_SUMMARY: return { title: 'Итоги', onBack: () => navigateTo(AppScreen.BOOKING_RACKETS) };
      case AppScreen.PAYMENT: return { title: 'Оплата', onBack: () => navigateTo(AppScreen.BOOKING_SUMMARY) };
      case AppScreen.HISTORY: return { title: 'История', onBack: () => navigateTo(AppScreen.DASHBOARD) };
      case AppScreen.PARTNERS: return { title: 'Партнеры' };
      case AppScreen.PROFILE: return { title: 'Профиль' };
      default: return {};
    }
  };

  return (
    <Layout activeScreen={currentScreen} onNavigate={navigateTo} showNav={user !== null && currentScreen !== AppScreen.AUTH && currentScreen !== AppScreen.ONBOARDING} hideHeader={currentScreen === AppScreen.ONBOARDING || currentScreen === AppScreen.AUTH} {...getScreenProps()}>
      {renderScreen()}
    </Layout>
  );
};

// UI Components
const QuickAction: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }> = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-start gap-3 hover:border-[#3362B5] transition-all group active:scale-[0.98]">
    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#3362B5]/10 transition-colors">{icon}</div>
    <div className="text-left"><h4 className="font-bold text-[#1B407F] text-sm leading-tight mb-1">{title}</h4><p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{subtitle}</p></div>
  </button>
);

const PromoCard: React.FC<{ color: string; text: string; onClick: () => void }> = ({ color, text, onClick }) => (
  <button onClick={onClick} className="flex-shrink-0 w-64 p-6 rounded-3xl text-white snap-start text-left active:scale-[0.98] transition-transform" style={{ backgroundColor: color }}>
    <p className="text-sm font-bold leading-relaxed mb-6">{text}</p>
    <div className="flex items-center gap-2"><span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Подробнее</span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
  </button>
);

const ProfileMenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full p-5 flex items-center justify-between group active:bg-gray-50 rounded-3xl transition-colors">
    <div className="flex items-center gap-4"><div className="text-gray-400 group-hover:text-[#3362B5] transition-colors">{icon}</div><span className="font-bold text-[#1B407F]">{label}</span></div>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
);

const ToggleItem: React.FC<{ label: string; active: boolean; onToggle: () => void }> = ({ label, active, onToggle }) => (
  <div className="p-5 flex justify-between items-center border-b border-gray-50 last:border-none">
    <span className="font-bold text-[#1B407F]">{label}</span>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-[#3362B5]' : 'bg-gray-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`}></div></button>
  </div>
);

const SupportOption: React.FC<{ color: string; label: string; onClick: () => void }> = ({ color, label, onClick }) => (
  <button onClick={onClick} className="w-full p-5 flex items-center gap-4 bg-white border border-gray-100 rounded-3xl active:scale-[0.98] transition-all">
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: color }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
    <span className="font-bold text-[#1B407F]">{label}</span>
  </button>
);

export default App;
