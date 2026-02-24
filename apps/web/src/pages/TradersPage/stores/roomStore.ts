import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  RoomParticipant,
  RoomPhase,
  RoomRoundResult,
  RoomStatus,
} from '../interfaces/room';

interface RoomState {
  roomId: string | null;
  roomCode: string | null;
  participantId: string | null;
  nickname: string | null;
  isHost: boolean;
  participants: RoomParticipant[];
  roomStatus: RoomStatus;
  roomPhase: RoomPhase;
  currentYear: number;
  roundResult: RoomRoundResult | null;
}

interface RoomActions {
  setRoom: (params: {
    roomId: string;
    roomCode: string;
    participantId: string;
    nickname: string;
    isHost: boolean;
  }) => void;
  setParticipants: (participants: RoomParticipant[]) => void;
  setRoomStatus: (status: RoomStatus) => void;
  setRoomPhase: (phase: RoomPhase) => void;
  setRoundResult: (result: RoomRoundResult | null) => void;
  setCurrentYear: (year: number) => void;
  setIsHost: (isHost: boolean) => void;
  reset: () => void;
}

const initialState: RoomState = {
  roomId: null,
  roomCode: null,
  participantId: null,
  nickname: null,
  isHost: false,
  participants: [],
  roomStatus: 'waiting',
  roomPhase: 'waiting_start',
  currentYear: 2010,
  roundResult: null,
};

export const useRoomStore = create<RoomState & RoomActions>()(
  persist(
    (set) => ({
      ...initialState,

      setRoom: ({ roomId, roomCode, participantId, nickname, isHost }) =>
        set({ roomId, roomCode, participantId, nickname, isHost }),

      setParticipants: (participants) => set({ participants }),

      setRoomStatus: (roomStatus) => set({ roomStatus }),

      setRoomPhase: (roomPhase) => set({ roomPhase }),

      setRoundResult: (roundResult) => set({ roundResult }),

      setCurrentYear: (currentYear) => set({ currentYear }),

      setIsHost: (isHost) => set({ isHost }),

      reset: () => set(initialState),
    }),
    {
      name: 'traders-room',
      partialize: (state) => ({
        roomId: state.roomId,
        roomCode: state.roomCode,
        participantId: state.participantId,
        nickname: state.nickname,
        isHost: state.isHost,
      }),
    },
  ),
);
