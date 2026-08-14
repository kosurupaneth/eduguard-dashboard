import React, { useState, useEffect } from 'react';
import {
  Student,
  SystemAlert,
  AppNotification,
  RiskSettings,
  MainTab,
  Intervention,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_ALERTS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_RISK_SETTINGS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { StudentProfileView } from './components/StudentProfileView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AddInterventionModal } from './components/AddInterventionModal';
import { AssignCounselorModal } from './components/AssignCounselorModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { BulkActionModal } from './components/BulkActionModal';

export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // App core state with persistence in localStorage if available
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('eduguard_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem('eduguard_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('eduguard_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<RiskSettings>(() => {
    const saved = localStorage.getItem('eduguard_settings');
    return saved ? JSON.parse(saved) : DEFAULT_RISK_SETTINGS;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('eduguard_theme') === 'dark';
  });

  // Modals state
  const [interventionStudent, setInterventionStudent] = useState<Student | null>(null);
  const [assignAlert, setAssignAlert] = useState<SystemAlert | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [systemToast, setSystemToast] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('eduguard_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('eduguard_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('eduguard_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('eduguard_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eduguard_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eduguard_theme', 'light');
    }
  }, [isDarkMode]);

  const triggerToast = (msg: string) => {
    setSystemToast(msg);
    setTimeout(() => setSystemToast(null), 3500);
  };

  // Handler: Add new intervention to a student
  const handleSaveIntervention = (
    studentId: string,
    newIntervention: Intervention,
    riskReduction: number = 0
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newScore = Math.max(10, s.riskScore - riskReduction);
          const newLevel = newScore >= 75 ? 'HIGH' : newScore >= 50 ? 'MEDIUM' : 'LOW';
          const updatedStudent: Student = {
            ...s,
            riskScore: newScore,
            riskLevel: newLevel,
            interventions: [newIntervention, ...s.interventions],
            riskBreakdown: {
              ...s.riskBreakdown,
              attendance: Math.max(10, s.riskBreakdown.attendance - 15),
              academics: Math.max(10, s.riskBreakdown.academics - 10),
            },
          };

          if (selectedStudent && selectedStudent.id === studentId) {
            setSelectedStudent(updatedStudent);
          }
          return updatedStudent;
        }
        return s;
      })
    );

    // Create system notification
    const student = students.find((s) => s.id === studentId);
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Intervention Recorded',
      message: `${newIntervention.title} logged for ${student?.name || 'student'}. Risk reduced by -${riskReduction} pts.`,
      timestamp: 'Just now',
      read: false,
      type: 'intervention',
      studentId,
    };
    setNotifications((prev) => [notif, ...prev]);
    triggerToast(`Intervention saved. ${student?.name}'s risk score updated to ${Math.max(10, (student?.riskScore || 80) - riskReduction)}.`);
  };

  // Handler: Assign counselor to an alert
  const handleConfirmAssign = (
    alertId: string,
    counselorName: string,
    priority: string,
    notes: string
  ) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'in_progress',
            assignedTo: counselorName,
          };
        }
        return a;
      })
    );

    const alert = alerts.find((a) => a.id === alertId);
    triggerToast(`Alert for ${alert?.studentName} assigned to ${counselorName} [Priority: ${priority}].`);
  };

  // Handler: Resolve alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'resolved',
          };
        }
        return a;
      })
    );
  };

  // Handler: Select student by ID from alerts or notifications
  const handleSelectStudentById = (studentId: string) => {
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setSelectedStudent(found);
      setIsNotificationOpen(false);
    }
  };

  // Handler: Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('All notifications marked as read.');
  };

  // Handler: Bulk Action
  const handleApplyBulkAction = (actionType: string, count: number, message: string) => {
    triggerToast(message);
  };

  const unreadAlertsCount = alerts.filter((a) => a.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Application Bar */}
      <Header
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onNavigateHome={() => {
          setSelectedStudent(null);
          setActiveTab('dashboard');
        }}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedStudent(null);
          setActiveTab(tab);
        }}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Content Area */}
      <main className="pt-20 px-4 pb-safe max-w-7xl mx-auto md:pl-72 md:pr-8">
        {selectedStudent ? (
          /* Screen 3: Student Profile Detail View */
          <StudentProfileView
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
            onAddIntervention={(student) => setInterventionStudent(student)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              /* Screen 1: Dashboard View */
              <DashboardView
                students={students}
                onSelectStudent={(student) => setSelectedStudent(student)}
                onIntervene={(student) => setInterventionStudent(student)}
                onViewAllAlerts={() => setActiveTab('alerts')}
              />
            )}

            {activeTab === 'students' && (
              /* Screen 2: Students List View */
              <StudentsView
                students={students}
                onSelectStudent={(student) => setSelectedStudent(student)}
                onBulkAction={() => setIsBulkModalOpen(true)}
              />
            )}

            {activeTab === 'alerts' && (
              /* Screen 4: Alerts Center */
              <AlertsView
                alerts={alerts}
                students={students}
                onSelectStudentById={handleSelectStudentById}
                onAssignCounselor={(alert) => setAssignAlert(alert)}
                onResolveAlert={handleResolveAlert}
              />
            )}

            {activeTab === 'reports' && (
              /* Screen 5: Reports & Retention Forecast */
              <ReportsView students={students} />
            )}

            {activeTab === 'settings' && (
              /* Screen 6: Settings & Risk Rules */
              <SettingsView
                settings={settings}
                onUpdateSettings={(newSettings) => {
                  setSettings(newSettings);
                  triggerToast('AI risk weights updated.');
                }}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {!selectedStudent && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedStudent(null);
            setActiveTab(tab);
          }}
          unreadAlertsCount={unreadAlertsCount}
        />
      )}

      {/* Modals */}
      {interventionStudent && (
        <AddInterventionModal
          student={interventionStudent}
          onClose={() => setInterventionStudent(null)}
          onSaveIntervention={handleSaveIntervention}
        />
      )}

      {assignAlert && (
        <AssignCounselorModal
          alert={assignAlert}
          onClose={() => setAssignAlert(null)}
          onConfirmAssign={handleConfirmAssign}
        />
      )}

      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={(notif) => {
          if (notif.studentId) {
            handleSelectStudentById(notif.studentId);
          }
        }}
      />

      {isBulkModalOpen && (
        <BulkActionModal
          students={students}
          onClose={() => setIsBulkModalOpen(false)}
          onApplyBulkAction={handleApplyBulkAction}
        />
      )}

      {/* Global Toast */}
      {systemToast && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          {systemToast}
        </div>
      )}
    </div>
  );
}
