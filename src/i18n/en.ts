// 英語翻訳
import type { Translations } from './types';

export const en: Translations = {
  nav: {
    home: 'Home',
    portfolio: 'Portfolio',
    strava: 'Strava',
  },
  aria: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    siteMenu: 'Site menu',
    switchLanguage: 'Switch to Japanese',
  },
  home: {
    subtitle: 'Sports × Tech Developer Portfolio',
    aboutHeading: 'About',
    aboutParagraph1:
      'Software developer working across the full 3D pipeline — from C++ geometry kernels and Blender addon scripting to interactive WebGL applications. Building with Three.js, Babylon.js, OpenCASCADE, React, and TypeScript.',
    aboutParagraph2:
      'This portfolio showcases projects in real-time 3D visualization, CAD geometry processing, Blender tooling, and sports data analytics — bridging native performance with modern web experiences.',
    skillHeading: {
      frontend: 'Frontend',
      webgl: '3D / WebGL',
      native: 'Native / CAD',
      infrastructure: 'Infrastructure',
    },
  },
  portfolio: {
    heading: 'Portfolio',
    subtitle:
      'Selected projects in sports tech, 3D visualization, and web development.',
  },
  strava: {
    heading: 'Strava',
    subtitle: 'Training activities from Strava.',
    connect: 'Connect with Strava',
    reconnect: 'Reconnect with Strava',
    authDenied: 'Authorization was denied.',
    authError: 'Authentication failed. Please try again.',
    monthLabel: 'Month',
    loading: 'Loading activities...',
    distance: 'Distance',
    time: 'Time',
    elevation: 'Elevation',
    noActivities: 'No activities found.',
    activities: 'activities',
    totalDistance: 'Total Distance',
    totalTime: 'Total Time',
    unknownDevice: 'Unknown Device',
    limitWarning: 'Showing up to 200 activities. Some may not be displayed.',
    disconnect: 'Disconnect Strava',
    disconnectConfirm: 'Are you sure you want to disconnect your Strava account?',
  },
  project: {
    website: 'Website',
    github: 'GitHub',
  },
  footer: {
    copyright: '© {year} Arus Systems',
  },
};
