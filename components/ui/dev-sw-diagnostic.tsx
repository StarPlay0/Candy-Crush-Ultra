'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trash2, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface SwDiagnosticState {
  isSupported: boolean;
  registrationState: string;
  scope: string | null;
  hasController: boolean;
  lastStatusCode: number | null;
  statusText: string | null;
  contentType: string | null;
  isJsMime: boolean;
  cacheCount: number;
  cacheNames: string[];
  lastCheckedTime: string | null;
  message: string | null;
  isLoading: boolean;
}

export function DevSwDiagnosticOverlay() {
  const [isDev, setIsDev] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, setState] = useState<SwDiagnosticState>({
    isSupported: false,
    registrationState: 'checking...',
    scope: null,
    hasController: false,
    lastStatusCode: null,
    statusText: null,
    contentType: null,
    isJsMime: false,
    cacheCount: 0,
    cacheNames: [],
    lastCheckedTime: null,
    message: null,
    isLoading: false,
  });

  // Verify dev environment mode
  useEffect(() => {
    const isDevelopment = 
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname.includes('ais-dev') || 
         window.location.port === '3000'));

    setIsDev(Boolean(isDevelopment));
  }, []);

  const inspectServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const supported = 'serviceWorker' in navigator;
    if (!supported) {
      setState((prev) => ({
        ...prev,
        isSupported: false,
        registrationState: 'unsupported',
      }));
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      let regState = 'unregistered';
      let scope: string | null = null;

      if (registration) {
        scope = registration.scope;
        if (registration.active) {
          regState = `active (${registration.active.state})`;
        } else if (registration.installing) {
          regState = `installing (${registration.installing.state})`;
        } else if (registration.waiting) {
          regState = `waiting (${registration.waiting.state})`;
        } else {
          regState = 'registered (inactive)';
        }
      }

      // Check caches
      let cacheNames: string[] = [];
      if ('caches' in window) {
        cacheNames = await caches.keys();
      }

      setState((prev) => ({
        ...prev,
        isSupported: true,
        registrationState: regState,
        scope,
        hasController: Boolean(navigator.serviceWorker.controller),
        cacheCount: cacheNames.length,
        cacheNames,
      }));
    } catch (err) {
      console.warn('[SW Diagnostic] Error inspecting registration:', err);
    }
  }, []);

  const fetchSwStatusCode = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/sw.js', {
        method: 'GET',
        cache: 'no-store',
        headers: { 'X-Requested-By': 'dev-diagnostic' },
      });

      const contentType = response.headers.get('content-type') || 'unknown';
      const text = await response.text();
      const trimmed = text.trim();
      const isHtml = trimmed.startsWith('<') || trimmed.includes('<!DOCTYPE') || trimmed.includes('<html');
      const isJsMime = (contentType.includes('javascript') || contentType.includes('ecmascript')) && !isHtml;

      setState((prev) => ({
        ...prev,
        lastStatusCode: response.status,
        statusText: response.statusText || (response.status === 200 ? 'OK' : 'Error'),
        contentType,
        isJsMime,
        lastCheckedTime: new Date().toLocaleTimeString(),
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        lastStatusCode: 0,
        statusText: error?.message || 'Network Error',
        contentType: null,
        isJsMime: false,
        lastCheckedTime: new Date().toLocaleTimeString(),
        isLoading: false,
      }));
    }
  }, []);

  const handleClearStorage = async () => {
    setState((prev) => ({ ...prev, isLoading: true, message: 'Clearing storage...' }));
    try {
      // 1. Unregister all ServiceWorkers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      // 2. Delete all caches
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }

      // 3. Clear LocalStorage and SessionStorage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // ignore if blocked in sandboxed context
      }

      // 4. Re-inspect status
      await inspectServiceWorker();
      await fetchSwStatusCode();

      setState((prev) => ({
        ...prev,
        isLoading: false,
        message: '✓ Storage and Service Workers cleared!',
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, message: null }));
      }, 4000);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message: `Error: ${err?.message || 'Failed to clear'}`,
      }));
    }
  };

  useEffect(() => {
    if (!isDev) return;

    inspectServiceWorker();
    fetchSwStatusCode();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', inspectServiceWorker);
      navigator.serviceWorker.addEventListener('message', inspectServiceWorker);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', inspectServiceWorker);
        navigator.serviceWorker.removeEventListener('message', inspectServiceWorker);
      }
    };
  }, [isDev, inspectServiceWorker, fetchSwStatusCode]);

  // Only appear in development mode
  if (!isDev) {
    return null;
  }

  const isStatusGood = state.lastStatusCode === 200 && state.isJsMime;
  const isRegActive = state.registrationState.includes('active');

  return (
    <div
      id="dev-sw-diagnostic-overlay"
      className="fixed bottom-20 left-3 sm:bottom-4 sm:left-4 z-[9999] max-w-sm font-mono text-xs select-none"
    >
      {/* Collapsed Badge Trigger */}
      {!isExpanded ? (
        <button
          id="dev-sw-diagnostic-trigger"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-slate-900/90 text-slate-100 hover:bg-slate-800 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 shadow-xl transition-all cursor-pointer group"
          title="Click to open Service Worker Diagnostics"
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-[11px] text-amber-300">SW Dev:</span>
          <span
            id="sw-status-code-badge"
            className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
              isStatusGood ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {state.lastStatusCode ? `${state.lastStatusCode}` : 'Fetch...'}
          </span>
          <span
            id="sw-reg-badge"
            className={`truncate max-w-[80px] font-bold text-[10px] ${
              isRegActive ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {state.registrationState.split(' ')[0]}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      ) : (
        /* Expanded Diagnostic Panel */
        <div className="bg-slate-950/95 text-slate-200 border-2 border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 w-80 sm:w-96 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-slate-100 tracking-wide text-[11px]">
                SW Diagnostics <span className="text-amber-400 font-normal">(Dev Mode)</span>
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
              title="Minimize overlay"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Diagnostic Metrics */}
          <div className="space-y-1.5 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80">
            {/* SW Registration State */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SW State:</span>
              <span
                id="sw-reg-state"
                className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  isRegActive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                    : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                }`}
              >
                {state.registrationState}
              </span>
            </div>

            {/* Controller status */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Page Controller:</span>
              <span className={`font-semibold ${state.hasController ? 'text-emerald-400' : 'text-slate-400'}`}>
                {state.hasController ? 'Controlled (Active)' : 'None (Bypassed)'}
              </span>
            </div>

            {/* Last /sw.js HTTP Status Code */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last /sw.js Code:</span>
              <div className="flex items-center gap-1.5">
                <span
                  id="sw-status-code"
                  className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    state.lastStatusCode === 200
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                  }`}
                >
                  {state.lastStatusCode !== null ? `${state.lastStatusCode} ${state.statusText}` : 'Checking...'}
                </span>
                <button
                  id="btn-refresh-sw"
                  onClick={() => {
                    fetchSwStatusCode();
                    inspectServiceWorker();
                  }}
                  disabled={state.isLoading}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Re-fetch /sw.js status"
                >
                  <RefreshCw className={`w-3 h-3 ${state.isLoading ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content-Type */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Content-Type:</span>
              <span
                className={`truncate max-w-[160px] font-mono text-[10px] ${
                  state.isJsMime ? 'text-emerald-300' : 'text-rose-300 font-bold'
                }`}
                title={state.contentType || 'none'}
              >
                {state.contentType || 'N/A'}
              </span>
            </div>

            {/* Cache Storage Count */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cache Buckets:</span>
              <span className="text-indigo-300 font-semibold">
                {state.cacheCount} {state.cacheCount > 0 ? `(${state.cacheNames.join(', ')})` : '(empty)'}
              </span>
            </div>

            {/* Last checked timestamp */}
            {state.lastCheckedTime && (
              <div className="text-[9px] text-slate-500 text-right pt-0.5">
                Checked at {state.lastCheckedTime}
              </div>
            )}
          </div>

          {/* Feedback notification */}
          {state.message && (
            <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 text-[10px] flex items-center gap-1.5 animate-in fade-in">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              id="btn-clear-storage"
              onClick={handleClearStorage}
              disabled={state.isLoading}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold transition-all shadow-md shadow-rose-900/40 cursor-pointer disabled:opacity-50 text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Storage</span>
            </button>

            <button
              id="btn-reload-page"
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-bold transition-all border border-slate-700 cursor-pointer text-[11px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Hard Reload</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
