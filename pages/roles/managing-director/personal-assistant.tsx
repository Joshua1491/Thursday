import React from 'react';
import { useRouter } from 'next/router';
import { RoleGuard } from '../../../components/RoleGuard';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { KpiSnapshot } from '../../../components/kpi/KpiSnapshot';
import { MeetingPrep } from '../../../components/meetings/MeetingPrep';
import { MedicalQa } from '../../../components/health/MedicalQa';
import { HealthDashboard } from '../../../components/health/HealthDashboard';
import { MealExercisePlanner } from '../../../components/health/Planner';
import { SmartCalendar } from '../../../components/productivity/SmartCalendar';
import { TravelHelper } from '../../../components/productivity/TravelHelper';

const tabs = [
  { label: 'Personal Assistant', href: '/roles/managing-director/personal-assistant' },
  { label: 'Medical', href: '/roles/managing-director/personal-assistant?tab=medical' },
  { label: 'Calendar', href: '/roles/managing-director/personal-assistant?tab=calendar' },
  { label: 'Travel', href: '/roles/managing-director/personal-assistant?tab=travel' },
];

export default function PersonalAssistant() {
  const router = useRouter();
  const activeTab = router.query.tab || 'personal-assistant';

  return (
    <RoleGuard allowedRoles={['Managing Director']}>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 bg-slate-50 min-h-screen">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Hello Mr. David!! What can I do for you today!</h1>
          {/* Tab Navigation */}
          <nav className="flex space-x-8 mb-8 border-b border-slate-200 pb-2">
            {tabs.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className={
                  'text-lg px-4 py-2 rounded-t-md transition-all duration-150 ' +
                  ((router.pathname === t.href && !router.query.tab) || 
                   (router.query.tab && t.href.includes(router.query.tab as string))
                    ? 'border-b-4 border-blue-600 font-semibold text-blue-700 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-slate-100')
                }
              >
                {t.label}
              </Link>
            ))}
          </nav>

          {/* Main Content */}
          <div className="space-y-10">
            {activeTab === 'personal-assistant' && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">My Personal Assistant</h2>
                {/* KPI Snapshot */}
                <div className="mb-10">
                  <KpiSnapshot />
                </div>
                {/* Meeting Preparation */}
                <div className="mb-10">
                  <MeetingPrep />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Quick Actions */}
                  <div className="bg-blue-50 p-6 rounded-2xl shadow-md border border-blue-100 flex flex-col justify-between min-h-[180px] hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold mb-3 text-blue-900">Quick Actions</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        <span>View Daily Summary</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        <span>Schedule Meeting</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        <span>Review Reports</span>
                      </li>
                    </ul>
                  </div>
                  {/* Upcoming Tasks */}
                  <div className="bg-green-50 p-6 rounded-2xl shadow-md border border-green-100 flex flex-col justify-between min-h-[180px] hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold mb-3 text-green-900">Upcoming Tasks</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span>Board Meeting - 2:00 PM</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span>Review Q2 Reports</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span>Team Briefing</span>
                      </li>
                    </ul>
                  </div>
                  {/* Notifications */}
                  <div className="bg-yellow-50 p-6 rounded-2xl shadow-md border border-yellow-100 flex flex-col justify-between min-h-[180px] hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold mb-3 text-yellow-900">Notifications</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span>New Sales Report Available</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span>Inventory Alert</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span>Meeting Reminder</span>
                      </li>
                    </ul>
                  </div>
                  {/* Wellbeing */}
                  <div className="bg-pink-50 p-6 rounded-2xl shadow-md border border-pink-100 flex flex-col justify-between min-h-[180px] hover:shadow-lg transition-shadow hidden lg:flex">
                    <h3 className="font-semibold mb-3 text-pink-900">Wellbeing</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                        <span>Take a short walk</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                        <span>Drink water</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                        <span>Stretch break</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'medical' && (
              <div className="space-y-8">
                <HealthDashboard />
                <div className="bg-white shadow rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Meal & Exercise Planner</h2>
                  <MealExercisePlanner />
                </div>
                <div className="bg-white shadow rounded-2xl p-8">
                  <MedicalQa />
                </div>
              </div>
            )}
            {activeTab === 'calendar' && (
              <div className="space-y-8">
                <div className="bg-white shadow rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Smart Calendar</h2>
                  <SmartCalendar />
                </div>
              </div>
            )}
            {activeTab === 'travel' && (
              <div className="space-y-8">
                <div className="bg-white shadow rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Travel Helper</h2>
                  <TravelHelper />
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </RoleGuard>
  );
} 