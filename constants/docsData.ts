import { ColorValue } from "react-native";

export type NotePreviewLine = string;
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

export interface Note {
  id: number;
  title: string;
  preview: NotePreviewLine[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isPinned?: boolean;
}

export interface NotesFolder {
  id: string;
  title: string;
  gradientColor: GradientColors;
  notes: Note[];
}

export function chunkArray<T>(array: T[], size = 3): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export const notesData = [
  {
    id: "icloud",
    title: "All iCloud",
    gradientColor: ["#ef4065", "#eb1943"] as GradientColors,
    notes: [
      {
        id: 0,
        title: "Build review",
        preview: [
          "Reviewed latest mobile build.",
          "iOS performance looks stable.",
          "Android needs scroll optimization.",
        ],
        createdAt: "2025-04-03T09:20:00.000Z",
        updatedAt: "2025-04-03T11:05:00.000Z",
      },
      {
        id: 1,
        title: "Untitled",
        preview: [
          "Folder open animation ideas:",
          "- stacked illusion",
          "- blur overlay",
          "- spring motion",
        ],
        createdAt: "2025-04-03T08:10:00.000Z",
        updatedAt: "2025-04-03T08:10:00.000Z",
      },
      {
        id: 2,
        title: "Shopping list",
        preview: ["- Eggs", "- Milk", "- Bread", "- Coffee beans"],
        createdAt: "2025-04-03T07:30:00.000Z",
        updatedAt: "2025-04-03T07:30:00.000Z",
      },
      {
        id: 3,
        title: "Routine",
        preview: ["- Morning walk", "- Gym (push day)", "- Work on animations"],
        createdAt: "2025-04-02T18:00:00.000Z",
        updatedAt: "2025-04-02T18:30:00.000Z",
      },
      {
        id: 4,
        title: "Interview prep",
        preview: [
          "Explain animation architecture.",
          "Mention performance tradeoffs.",
          "Prepare system design answers.",
        ],
        createdAt: "2025-04-02T14:40:00.000Z",
        updatedAt: "2025-04-02T14:40:00.000Z",
      },
      {
        id: 5,
        title: "That girl",
        preview: ["@thatgirl", "Saved reels", "Morning routine inspo"],
        createdAt: "2025-04-01T19:10:00.000Z",
        updatedAt: "2025-04-01T19:10:00.000Z",
      },
    ],
  },
  {
    id: "work",
    title: "Work",
    gradientColor: ["#3488ff", "#18aaeb"] as GradientColors,
    notes: [
      {
        id: 0,
        title: "Sprint tasks",
        preview: [
          "- Fix folder animation",
          "- Optimize FlatList",
          "- Review PRs",
        ],
        createdAt: "2025-04-03T10:00:00.000Z",
        updatedAt: "2025-04-03T10:00:00.000Z",
      },
      {
        id: 1,
        title: "Bug report",
        preview: [
          "Reanimated flicker on Android.",
          "Occurs when folder closes quickly.",
        ],
        createdAt: "2025-04-03T09:00:00.000Z",
        updatedAt: "2025-04-03T09:30:00.000Z",
      },
      {
        id: 2,
        title: "Meeting notes",
        preview: [
          "Discussed animation timeline.",
          "Agreed on spring-based motion.",
        ],
        createdAt: "2025-04-02T16:00:00.000Z",
        updatedAt: "2025-04-02T16:20:00.000Z",
      },
      {
        id: 3,
        title: "Release checklist",
        preview: ["- QA pass", "- Update changelog", "- Tag release"],
        createdAt: "2025-04-02T13:00:00.000Z",
        updatedAt: "2025-04-02T13:00:00.000Z",
      },
      {
        id: 4,
        title: "Tech debt",
        preview: ["Refactor animation hooks.", "Reduce shared value count."],
        createdAt: "2025-04-01T17:30:00.000Z",
        updatedAt: "2025-04-01T17:30:00.000Z",
      },
      {
        id: 5,
        title: "Ideas",
        preview: ["Stack-slot mental model.", "Fake layer for smooth reorder."],
        createdAt: "2025-04-01T15:00:00.000Z",
        updatedAt: "2025-04-01T15:00:00.000Z",
      },
    ],
  },
  {
    id: "personal",
    title: "Personal",
    gradientColor: ["#ffea00", "#ffa200"] as GradientColors,
    notes: [
      {
        id: 0,
        title: "Daily journal",
        preview: ["Good focus today.", "Animations are finally clicking."],
        createdAt: "2025-04-03T21:30:00.000Z",
        updatedAt: "2025-04-03T21:30:00.000Z",
      },
      {
        id: 1,
        title: "Fitness goals",
        preview: [
          "- Increase stamina",
          "- Consistent workouts",
          "- Better sleep",
        ],
        createdAt: "2025-04-03T06:30:00.000Z",
        updatedAt: "2025-04-03T06:30:00.000Z",
      },
      {
        id: 2,
        title: "Books to read",
        preview: ["- Atomic Habits", "- Deep Work", "- Psychology of Design"],
        createdAt: "2025-04-02T20:00:00.000Z",
        updatedAt: "2025-04-02T20:00:00.000Z",
      },
      {
        id: 3,
        title: "Travel ideas",
        preview: ["Short trip to mountains.", "Work-friendly locations."],
        createdAt: "2025-04-02T11:00:00.000Z",
        updatedAt: "2025-04-02T11:00:00.000Z",
      },
      {
        id: 4,
        title: "Learning plan",
        preview: ["Master Reanimated layouts.", "Study gesture conflicts."],
        createdAt: "2025-04-01T10:00:00.000Z",
        updatedAt: "2025-04-01T10:00:00.000Z",
      },
      {
        id: 5,
        title: "Random thoughts",
        preview: ["Simplicity beats cleverness.", "Smooth UX is invisible."],
        createdAt: "2025-04-01T22:15:00.000Z",
        updatedAt: "2025-04-01T22:15:00.000Z",
      },
    ],
  },
];
