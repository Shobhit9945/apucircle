import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Announcement from '../models/Announcement.js';
import Club from '../models/Club.js';
import ClubLeaderApplication from '../models/ClubLeaderApplication.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import PlatformAnnouncement from '../models/PlatformAnnouncement.js';
import User from '../models/User.js';

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  await connectDB();

  if (!process.env.STAFF_SEED_EMAIL || !process.env.STAFF_SEED_PASSWORD) {
    throw new Error('STAFF_SEED_EMAIL and STAFF_SEED_PASSWORD are required to seed the staff account.');
  }

  const studentPassword = process.env.SEED_STUDENT_PASSWORD || crypto.randomBytes(10).toString('base64url');
  const [staffPasswordHash, studentPasswordHash] = await Promise.all([
    bcrypt.hash(process.env.STAFF_SEED_PASSWORD, 12),
    bcrypt.hash(studentPassword, 12)
  ]);

  await Promise.all([
    Announcement.deleteMany({}),
    Club.deleteMany({}),
    ClubLeaderApplication.deleteMany({}),
    Event.deleteMany({}),
    Notification.deleteMany({}),
    PlatformAnnouncement.deleteMany({}),
    User.deleteMany({})
  ]);

  const [staff, studentA, studentB, studentC] = await User.create([
    {
      fullName: 'APU Student Office',
      email: process.env.STAFF_SEED_EMAIL.toLowerCase(),
      passwordHash: staffPasswordHash,
      role: 'staff',
      languageBasis: 'English',
      semester: 1,
      interests: [],
      isVerified: true
    },
    {
      fullName: 'Rina Tanaka',
      email: 'rina.tanaka@apu.ac.jp',
      passwordHash: studentPasswordHash,
      role: 'club_leader',
      languageBasis: 'English',
      semester: 4,
      interests: ['Debate', 'Entrepreneurship', 'Technology', 'Language Exchange'],
      isVerified: true
    },
    {
      fullName: 'Minh Nguyen',
      email: 'minh.nguyen@apu.ac.jp',
      passwordHash: studentPasswordHash,
      role: 'student',
      languageBasis: 'English',
      semester: 2,
      interests: ['Music', 'Dance', 'Culture', 'Community Service'],
      isVerified: true
    },
    {
      fullName: 'Haruka Sato',
      email: 'haruka.sato@apu.ac.jp',
      passwordHash: studentPasswordHash,
      role: 'student',
      languageBasis: 'Japanese',
      semester: 6,
      interests: ['Sailing', 'Sports', 'Photography', 'Language Exchange'],
      isVerified: true
    }
  ]);

  const clubs = await Club.create([
    {
      name: 'APU Debate Society',
      slug: 'apu-debate-society',
      description:
        'A bilingual debate community where students practice public speaking, critical thinking, and tournament preparation in a supportive environment.',
      category: 'Academic',
      tags: ['Debate', 'Public Speaking', 'English', 'Japanese', 'Leadership'],
      languageOfOperation: 'Bilingual',
      meetingSchedule: 'Tuesdays 6:15 PM, F Building discussion rooms',
      bannerImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
      profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
      leaders: [{ userId: studentA._id, role: 'President', joinedAt: daysAgo(180) }],
      members: [
        { userId: studentA._id, role: 'Member', joinedAt: daysAgo(180) },
        { userId: studentB._id, role: 'Member', joinedAt: daysAgo(25) }
      ],
      joinRequests: [{ userId: studentC._id, requestedAt: daysAgo(1) }],
      instagramHandle: '@apudebate',
      contactEmail: 'debate@apu.ac.jp',
      isActive: true,
      isVerifiedByStaff: true
    },
    {
      name: 'Beppu Bay Sailing Circle',
      slug: 'beppu-bay-sailing-circle',
      description:
        'A circle for students who want to learn sailing basics, enjoy Beppu Bay, and build confidence through safe water activities.',
      category: 'Sports',
      tags: ['Sailing', 'Sports', 'Outdoors', 'Beppu Bay'],
      languageOfOperation: 'Bilingual',
      meetingSchedule: 'Saturdays 9:00 AM, Beppu Bay marina',
      bannerImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      profileImage: 'https://images.unsplash.com/photo-1494557985045-edf25e08da73',
      leaders: [{ userId: studentC._id, role: 'Captain', joinedAt: daysAgo(210) }],
      members: [
        { userId: studentC._id, role: 'Member', joinedAt: daysAgo(210) },
        { userId: studentA._id, role: 'Member', joinedAt: daysAgo(10) }
      ],
      instagramHandle: '@beppubaysailing',
      contactEmail: 'sailing@apu.ac.jp',
      isActive: true,
      isVerifiedByStaff: true
    },
    {
      name: 'APU Tech Lab',
      slug: 'apu-tech-lab',
      description:
        'A project-based technology club for students interested in web development, product design, hackathons, and startup prototypes.',
      category: 'Technology',
      tags: ['Technology', 'Programming', 'Startups', 'Hackathon', 'Design'],
      languageOfOperation: 'English',
      meetingSchedule: 'Fridays 5:30 PM, Library makerspace',
      bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      profileImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
      leaders: [{ userId: studentA._id, role: 'Project Lead', joinedAt: daysAgo(80) }],
      members: [{ userId: studentA._id, role: 'Member', joinedAt: daysAgo(80) }],
      joinRequests: [{ userId: studentB._id, requestedAt: daysAgo(2) }],
      instagramHandle: '@aputechlab',
      contactEmail: 'techlab@apu.ac.jp',
      isActive: true,
      isVerifiedByStaff: true
    },
    {
      name: 'Global Music Collective',
      slug: 'global-music-collective',
      description:
        'A relaxed music circle for singers, instrumentalists, producers, and listeners who want to collaborate across genres and cultures.',
      category: 'Music',
      tags: ['Music', 'Band', 'Performance', 'Culture'],
      languageOfOperation: 'Bilingual',
      meetingSchedule: 'Wednesdays 7:00 PM, Student Union music room',
      bannerImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      leaders: [],
      members: [{ userId: studentB._id, role: 'Member', joinedAt: daysAgo(70) }],
      instagramHandle: '@apumusic',
      contactEmail: 'music@apu.ac.jp',
      isActive: true,
      isVerifiedByStaff: true
    },
    {
      name: 'Language Exchange Cafe',
      slug: 'language-exchange-cafe',
      description:
        'A weekly social space for Japanese, English, and multilingual language exchange through games, discussion prompts, and campus friendships.',
      category: 'Language',
      tags: ['Language Exchange', 'Japanese', 'English', 'Culture', 'Community'],
      languageOfOperation: 'Bilingual',
      meetingSchedule: 'Mondays 6:00 PM, Cafeteria side lounge',
      bannerImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      profileImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
      leaders: [],
      members: [],
      instagramHandle: '@apulanguagecafe',
      contactEmail: 'languagecafe@apu.ac.jp',
      isActive: true,
      isVerifiedByStaff: false
    }
  ]);

  studentA.joinedClubs = [
    { clubId: clubs[0]._id, joinedAt: daysAgo(180) },
    { clubId: clubs[1]._id, joinedAt: daysAgo(10) },
    { clubId: clubs[2]._id, joinedAt: daysAgo(80) }
  ];
  studentB.joinedClubs = [
    { clubId: clubs[0]._id, joinedAt: daysAgo(25) },
    { clubId: clubs[3]._id, joinedAt: daysAgo(70) }
  ];
  studentC.joinedClubs = [{ clubId: clubs[1]._id, joinedAt: daysAgo(210) }];
  studentC.role = 'club_leader';
  await Promise.all([studentA.save(), studentB.save(), studentC.save()]);

  await Announcement.create([
    {
      clubId: clubs[0]._id,
      authorId: studentA._id,
      title: 'Spring tournament prep starts this week',
      body: 'We will practice debate cases and rebuttal drills. New members are welcome to observe.',
      isPinned: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5)
    },
    {
      clubId: clubs[1]._id,
      authorId: studentC._id,
      title: 'Safety briefing before Saturday sailing',
      body: 'Please arrive ten minutes early and bring water. Life jackets will be provided.',
      isPinned: false,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12)
    },
    {
      clubId: clubs[2]._id,
      authorId: studentA._id,
      title: 'Hackathon idea night',
      body: 'Bring a small campus problem you want to solve. We will form teams after lightning pitches.',
      isPinned: false,
      createdAt: daysAgo(45),
      updatedAt: daysAgo(45)
    },
    {
      clubId: clubs[3]._id,
      authorId: studentB._id,
      title: 'Open jam archive',
      body: 'Thanks to everyone who joined our last open jam. We are pausing meetings until new leaders are confirmed.',
      isPinned: false,
      createdAt: daysAgo(120),
      updatedAt: daysAgo(120)
    }
  ]);

  await Event.create([
    {
      clubId: clubs[0]._id,
      authorId: studentA._id,
      title: 'Beginner Debate Workshop',
      description: 'A practical introduction to argument structure, notes, and speaking confidence.',
      location: 'F Building, Room 201',
      eventDate: daysFromNow(6)
    },
    {
      clubId: clubs[1]._id,
      authorId: studentC._id,
      title: 'Beppu Bay Morning Sail',
      description: 'A supervised beginner-friendly sailing session with equipment orientation.',
      location: 'Beppu Bay Marina',
      eventDate: daysFromNow(10)
    },
    {
      clubId: clubs[2]._id,
      authorId: studentA._id,
      title: 'Campus App Prototype Sprint',
      description: 'Two-hour build sprint for student-life product ideas.',
      location: 'Library Makerspace',
      eventDate: daysFromNow(14)
    }
  ]);

  await ClubLeaderApplication.create({
    userId: studentB._id,
    clubId: clubs[3]._id,
    reason:
      'I want to restart regular music sessions and organize beginner-friendly collaboration nights so students can join without needing a full band already.',
    status: 'pending'
  });

  console.log('Seed complete.');
  console.log(`Staff login: ${process.env.STAFF_SEED_EMAIL}`);
  if (!process.env.SEED_STUDENT_PASSWORD) {
    console.log(`Generated student password for all sample students: ${studentPassword}`);
  } else {
    console.log('Sample students use SEED_STUDENT_PASSWORD.');
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
