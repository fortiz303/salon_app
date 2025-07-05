import React, { useState, useEffect } from 'react';
import { Clock, Users, Scissors, UserCheck, Bell, BarChart3, Settings, Phone, Mail } from 'lucide-react';

const QueueSnip = () => {
  const [currentView, setCurrentView] = useState('client');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sample data
  const [barbers] = useState([
    { id: 1, name: 'Alex Johnson', avatar: '👨‍🦲', active: true, currentClient: null },
    { id: 2, name: 'Sarah Davis', avatar: '👩‍🦳', active: true, currentClient: null },
    { id: 3, name: 'Mike Chen', avatar: '👨‍🦱', active: false, currentClient: null }
  ]);

  const services = [
    { id: 'haircut', name: 'Haircut', duration: 30, price: 45 },
    { id: 'shave', name: 'Shave', duration: 10, price: 20 },
    { id: 'haircut-shave', name: 'Haircut + Shave', duration: 40, price: 60 },
    { id: 'styling', name: 'Hair Styling', duration: 20, price: 30 }
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate wait time for a position in queue
  const calculateWaitTime = (position, barberId) => {
    const barberQueue = queue.filter(q => q.barberId === barberId);
    let totalTime = 0;
    
    for (let i = 0; i < position; i++) {
      if (barberQueue[i]) {
        const service = services.find(s => s.id === barberQueue[i].serviceId);
        totalTime += service ? service.duration : 30;
      }
    }
    
    return totalTime;
  };

  // Get queue position for a barber
  const getQueuePosition = (barberId) => {
    return queue.filter(q => q.barberId === barberId).length;
  };

  // Join queue
  const joinQueue = () => {
    if (!clientName || !selectedBarber || !selectedService) {
      alert('Please fill in all fields');
      return;
    }

    const newQueueItem = {
      id: Date.now(),
      clientName,
      clientPhone,
      barberId: parseInt(selectedBarber),
      serviceId: selectedService,
      joinTime: new Date(),
      status: 'waiting',
      notified: false
    };

    setQueue([...queue, newQueueItem]);
    setClientName('');
    setClientPhone('');
    setSelectedBarber('');
    setSelectedService('');
    alert(`You've joined the queue! Your queue number is #${newQueueItem.id.toString().slice(-4)}`);
  };

  // Complete service (barber dashboard)
  const completeService = (queueId) => {
    setQueue(queue.filter(q => q.id !== queueId));
  };

  // Get current client for barber
  const getCurrentClient = (barberId) => {
    return queue.find(q => q.barberId === barberId && q.status === 'waiting');
  };

  // Client View
  const ClientView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">QueueSnip</h1>
        <p className="opacity-90">Skip the wait, book your spot!</p>
      </div>

      {/* Service Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Scissors className="w-5 h-5 mr-2" />
          Choose Your Service
        </h3>
        <div className="space-y-3">
          {services.map(service => (
            <label key={service.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={selectedService === service.id}
                onChange={(e) => setSelectedService(e.target.value)}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-600">{service.duration} min • ${service.price}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Barber Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Choose Your Barber
        </h3>
        <div className="space-y-3">
          {barbers.map(barber => {
            const queueCount = getQueuePosition(barber.id);
            const waitTime = calculateWaitTime(queueCount, barber.id);
            
            return (
              <label key={barber.id} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${!barber.active ? 'opacity-50' : ''}`}>
                <input
                  type="radio"
                  name="barber"
                  value={barber.id}
                  checked={selectedBarber === barber.id.toString()}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                  disabled={!barber.active}
                  className="mr-3"
                />
                <div className="text-2xl mr-3">{barber.avatar}</div>
                <div className="flex-1">
                  <div className="font-medium">{barber.name}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {queueCount} in queue • ~{waitTime} min wait
                  </div>
                </div>
                {barber.active && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Client Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Your Details</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="tel"
            placeholder="Phone Number (for notifications)"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
      </div>

      {/* Join Queue Button */}
      <button
        onClick={joinQueue}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        Join Queue
      </button>

      {/* Current Queue Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Current Queue Status</h3>
        {queue.length === 0 ? (
          <p className="text-gray-600">No one in queue right now!</p>
        ) : (
          <div className="space-y-3">
            {barbers.map(barber => {
              const barberQueue = queue.filter(q => q.barberId === barber.id);
              if (barberQueue.length === 0) return null;
              
              return (
                <div key={barber.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-xl mr-2">{barber.avatar}</span>
                    <span className="font-medium">{barber.name}</span>
                    <span className="ml-auto text-sm text-gray-600">
                      {barberQueue.length} in queue
                    </span>
                  </div>
                  {barberQueue.slice(0, 3).map((client, index) => (
                    <div key={client.id} className="flex items-center justify-between py-2 border-t">
                      <span className="text-sm">
                        #{client.id.toString().slice(-4)} - {client.clientName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {index === 0 ? 'Up next' : `~${calculateWaitTime(index, barber.id)} min`}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Barber Dashboard
  const BarberDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Barber Dashboard</h1>
        <p className="opacity-90">Manage your queue and clients</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total in Queue</p>
              <p className="text-2xl font-bold">{queue.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Barbers</p>
              <p className="text-2xl font-bold">{barbers.filter(b => b.active).length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Barber Queues */}
      <div className="space-y-4">
        {barbers.map(barber => {
          const barberQueue = queue.filter(q => q.barberId === barber.id);
          const currentClient = getCurrentClient(barber.id);
          
          return (
            <div key={barber.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{barber.avatar}</span>
                  <div>
                    <h3 className="font-semibold">{barber.name}</h3>
                    <p className="text-sm text-gray-600">
                      {barberQueue.length} clients waiting
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${barber.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {barber.active ? 'Active' : 'Inactive'}
                </div>
              </div>

              {currentClient && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Client</p>
                      <p className="text-sm text-gray-600">
                        #{currentClient.id.toString().slice(-4)} - {currentClient.clientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Service: {services.find(s => s.id === currentClient.serviceId)?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => completeService(currentClient.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Complete Service
                    </button>
                  </div>
                </div>
              )}

              {barberQueue.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Upcoming Clients</h4>
                  {barberQueue.slice(currentClient ? 1 : 0).map((client, index) => {
                    const service = services.find(s => s.id === client.serviceId);
                    const waitTime = calculateWaitTime(index + (currentClient ? 1 : 0), barber.id);
                    
                    return (
                      <div key={client.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">#{client.id.toString().slice(-4)}</span>
                          <span className="mx-2">-</span>
                          <span>{client.clientName}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({service?.name})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          ~{waitTime} min
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {barberQueue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No clients in queue</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setCurrentView('client')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'client'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Client View
            </button>
            <button
              onClick={() => setCurrentView('barber')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'barber'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Barber Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {currentView === 'client' ? <ClientView /> : <BarberDashboard />}
      </div>
    </div>
  );
};

export default QueueSnip;
