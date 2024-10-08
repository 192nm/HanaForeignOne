import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 유저 정보 가져오기
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8081/getUserProfile/${userId}`);
      return response.data; // 유저의 상세 정보 반환
    } catch (error) {
      return thunkAPI.rejectWithValue('유저 정보를 불러오는 데 실패했습니다.');
    }
  }
);

const initialState = {
  isLoggedIn: false,
  userId: '',    // 사용자 아이디 저장
  userName: '',  // 사용자 이름 저장
  userProfile: {},  // 유저의 상세 정보 저장
  loading: false,  // 로딩 상태
  error: null,     // 에러 상태
  showWallet: false, // 지갑 생성 상태
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;    // userId 저장
      state.userName = action.payload.userName; // userName 저장
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = ''; 
      state.userName = ''; 
      state.userProfile = {};
      state.showWallet = false; // 로그아웃 시 지갑 상태 초기화
    },
    setShowWallet: (state, action) => {
      state.showWallet = action.payload; // 지갑 생성 상태 설정
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload; // API로부터 불러온 유저 정보 저장
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { login, logout, setShowWallet } = authSlice.actions; // setShowWallet 액션 export 추가
export default authSlice.reducer;
