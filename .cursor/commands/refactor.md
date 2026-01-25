# Smart Refactoring Command

시니어 프론트엔드 개발자 수준의 리팩토링을 수행하는 명령어입니다. CLAUDE.md의 원칙과 현대적 개발 패턴을 반영하여 코드를 체계적으로 개선합니다.

## 사용법
```
/refactor <파일경로1> [파일경로2] [파일경로3]
/refactor src/components/LoginForm.tsx
/refactor src/components/UserProfile.tsx src/hooks/useUser.ts
/refactor src/pages/Dashboard.tsx src/components/Chart.tsx src/utils/api.ts
```

## 리팩토링 원칙

### 1. 단일 책임 원칙 (Single Responsibility Principle)
- **컴포넌트 분리**: 하나의 컴포넌트는 하나의 책임만 가져야 함
- **함수 분리**: 하나의 함수는 하나의 작업만 수행
- **훅 분리**: 각 훅은 특정 도메인의 로직만 담당

### 2. 로직과 UI 분리
- **비즈니스 로직**: 커스텀 훅으로 추출
- **UI 컴포넌트**: 순수한 렌더링 로직만 포함
- **상태 관리**: 컴포넌트 외부로 분리

### 3. CLAUDE.md 원칙 적용
- **가독성**: 명확한 네이밍, 매직 넘버 제거
- **예측 가능성**: 일관된 패턴, 표준화된 반환 타입
- **응집성**: 관련 코드를 한 곳에 모으기
- **결합도**: 컴포넌트 간 의존성 최소화

## 리팩토링 패턴

### Before: 모든 책임이 섞인 컴포넌트
```typescript
// src/components/UserDashboard.tsx (리팩토링 전)
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@cllaude99/ui';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 사용자 정보 로드
    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (err) {
        setError('사용자 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 게시물 로드
    const loadPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('게시물 로드 실패:', err);
      }
    };

    loadUser();
    loadPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const calculatePostStats = () => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    return { totalPosts, totalLikes, avgLikes: totalLikes / totalPosts };
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const stats = calculatePostStats();

  return (
    <div style={{ padding: '20px' }}>
      <h1>대시보드</h1>
      
      {/* 사용자 정보 */}
      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h2>{user?.name}</h2>
        <p>이메일: {user?.email}</p>
        <p>가입일: {user?.createdAt}</p>
      </div>

      {/* 통계 정보 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>총 게시물: {stats.totalPosts}</div>
        <div>총 좋아요: {stats.totalLikes}</div>
        <div>평균 좋아요: {stats.avgLikes.toFixed(1)}</div>
      </div>

      {/* 게시물 목록 */}
      <div>
        <h3>게시물 목록</h3>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #eee', padding: '10px', margin: '10px 0' }}>
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>좋아요: {post.likes}</span>
              <Button onClick={() => handleDeletePost(post.id)}>삭제</Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
          <div style={{ background: 'white', padding: '20px' }}>
            <h3>설정</h3>
            <Button onClick={() => setShowModal(false)}>닫기</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
```

### After: 책임별로 분리된 구조
```typescript
// 1. 비즈니스 로직 분리 - 커스텀 훅
// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { fetchUser } from '@/api/user';
import type { User } from '@/types/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUser();
        setUser(userData);
      } catch (err) {
        setError('사용자 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, isLoading, error };
};

// src/hooks/usePosts.ts
import { useState, useEffect } from 'react';
import { fetchPosts, deletePost } from '@/api/posts';
import type { Post } from '@/types/post';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const postsData = await fetchPosts();
        setPosts(postsData);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      throw new Error('게시물 삭제에 실패했습니다.');
    }
  };

  return { posts, isLoading, handleDeletePost };
};

// 2. 유틸리티 함수 분리
// src/utils/postStats.ts
import type { Post } from '@/types/post';

export interface PostStats {
  totalPosts: number;
  totalLikes: number;
  avgLikes: number;
}

export const calculatePostStats = (posts: Post[]): PostStats => {
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  
  return {
    totalPosts,
    totalLikes,
    avgLikes: totalPosts > 0 ? totalLikes / totalPosts : 0
  };
};

// 3. UI 컴포넌트들 분리
// src/components/UserProfile/index.tsx
import type { User } from '@/types/user';
import * as S from './UserProfile.styles';

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <S.Container>
      <S.Name>{user.name}</S.Name>
      <S.Email>이메일: {user.email}</S.Email>
      <S.CreatedAt>가입일: {user.createdAt}</S.CreatedAt>
    </S.Container>
  );
};

export default UserProfile;

// src/components/PostStats/index.tsx
import type { PostStats } from '@/utils/postStats';
import * as S from './PostStats.styles';

interface PostStatsProps {
  stats: PostStats;
}

const PostStats = ({ stats }: PostStatsProps) => {
  return (
    <S.Container>
      <S.Stat>총 게시물: {stats.totalPosts}</S.Stat>
      <S.Stat>총 좋아요: {stats.totalLikes}</S.Stat>
      <S.Stat>평균 좋아요: {stats.avgLikes.toFixed(1)}</S.Stat>
    </S.Container>
  );
};

export default PostStats;

// src/components/PostList/index.tsx
import { Button } from '@cllaude99/ui';
import type { Post } from '@/types/post';
import * as S from './PostList.styles';

interface PostListProps {
  posts: Post[];
  onDeletePost: (postId: string) => Promise<void>;
}

const PostList = ({ posts, onDeletePost }: PostListProps) => {
  const handleDelete = async (postId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await onDeletePost(postId);
      } catch (err) {
        alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
      }
    }
  };

  return (
    <S.Container>
      <S.Title>게시물 목록</S.Title>
      {posts.map(post => (
        <S.PostItem key={post.id}>
          <S.PostTitle>{post.title}</S.PostTitle>
          <S.PostContent>{post.content.substring(0, 100)}...</S.PostContent>
          <S.PostFooter>
            <S.LikeCount>좋아요: {post.likes}</S.LikeCount>
            <Button onClick={() => handleDelete(post.id)}>삭제</Button>
          </S.PostFooter>
        </S.PostItem>
      ))}
    </S.Container>
  );
};

export default PostList;

// 4. 메인 컴포넌트 - 순수한 조합 로직만
// src/components/UserDashboard/index.tsx
import { useUser } from '@/hooks/useUser';
import { usePosts } from '@/hooks/usePosts';
import { calculatePostStats } from '@/utils/postStats';
import UserProfile from '@/components/UserProfile';
import PostStats from '@/components/PostStats';
import PostList from '@/components/PostList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import * as S from './UserDashboard.styles';

const UserDashboard = () => {
  const { user, isLoading: userLoading, error: userError } = useUser();
  const { posts, isLoading: postsLoading, handleDeletePost } = usePosts();

  if (userLoading) return <LoadingSpinner />;
  if (userError) return <ErrorMessage message={userError} />;
  if (!user) return <ErrorMessage message="사용자 정보가 없습니다." />;

  const postStats = calculatePostStats(posts);

  return (
    <S.Container>
      <S.Title>대시보드</S.Title>
      
      <UserProfile user={user} />
      <PostStats stats={postStats} />
      
      {postsLoading ? (
        <LoadingSpinner />
      ) : (
        <PostList posts={posts} onDeletePost={handleDeletePost} />
      )}
    </S.Container>
  );
};

export default UserDashboard;
```

## 자동 리팩토링 기능

### 1. 코드 분석 및 문제점 식별
- **거대한 컴포넌트**: 200줄 이상의 컴포넌트 분리
- **다중 책임**: 여러 도메인 로직이 섞인 컴포넌트
- **인라인 스타일**: CSS-in-JS로 분리 필요
- **하드코딩**: 매직 넘버, 문자열 상수화
- **중복 로직**: 공통 함수로 추출

### 2. 자동 분리 전략
- **커스텀 훅 추출**: `useState`, `useEffect` 로직 분리
- **컴포넌트 분할**: JSX 블록별 컴포넌트 분리
- **유틸리티 함수**: 순수 함수 로직 분리
- **타입 정의**: 인터페이스 및 타입 분리
- **스타일 분리**: Emotion 스타일 컴포넌트 생성

### 3. CLAUDE.md 원칙 적용
- **Import 순서**: 자동 정렬 및 그룹핑
- **네이밍 컨벤션**: 일관된 명명 규칙 적용
- **파일 구조**: 프로젝트 패턴에 맞는 구조 생성
- **타입 안전성**: TypeScript 타입 강화

## 리팩토링 프로세스

### 1. 분석 단계
```
🔍 코드 분석 중...

📊 분석 결과:
├── UserDashboard.tsx: 245줄, 8개 책임 발견
├── 분리 가능한 컴포넌트: 4개
├── 추출 가능한 훅: 2개
├── 유틸리티 함수: 1개
└── 스타일 분리 필요: 15개 인라인 스타일

🎯 리팩토링 계획:
├── useUser 훅 생성
├── usePosts 훅 생성  
├── UserProfile 컴포넌트 분리
├── PostList 컴포넌트 분리
├── PostStats 컴포넌트 분리
└── 스타일 파일 생성
```

### 2. 실행 단계
```
🚀 리팩토링 실행 중...

✅ useUser.ts 생성 완료
✅ usePosts.ts 생성 완료
✅ UserProfile 컴포넌트 생성 완료
✅ PostList 컴포넌트 생성 완료
✅ PostStats 컴포넌트 생성 완료
✅ 스타일 파일 생성 완료
✅ 메인 컴포넌트 리팩토링 완료

📋 생성된 파일:
├── src/hooks/useUser.ts
├── src/hooks/usePosts.ts
├── src/components/UserProfile/
├── src/components/PostList/
├── src/components/PostStats/
└── src/utils/postStats.ts
```

### 3. 검증 단계
```
🧪 검증 중...

✅ TypeScript 컴파일: 통과
✅ ESLint 검사: 통과
✅ 테스트 실행: 통과
✅ 번들 크기: 2.3KB 감소
✅ 성능: 렌더링 최적화 완료

📈 개선 효과:
├── 코드 라인 수: 245 → 180 (26% 감소)
├── 컴포넌트 복잡도: 8 → 2 (75% 감소)  
├── 재사용 가능 컴포넌트: 4개 생성
├── 테스트 커버리지: 향상 가능
└── 유지보수성: 크게 향상
```

## 리팩토링 규칙

### 1. 컴포넌트 분리 기준
- **50줄 이상**: 분리 고려
- **100줄 이상**: 분리 권장  
- **200줄 이상**: 반드시 분리

### 2. 훅 추출 기준
- **3개 이상 상태**: 도메인별 훅 분리
- **비즈니스 로직**: 컴포넌트에서 분리
- **API 호출**: 전용 훅으로 분리

### 3. 유틸리티 함수 분리
- **순수 함수**: 별도 파일로 분리
- **복잡한 계산**: 유틸리티로 추출
- **재사용 로직**: 공통 함수로 만들기

## 주의사항

- **기능 동작 보장**: 리팩토링 후에도 동일한 동작
- **타입 안전성 유지**: TypeScript 컴파일 오류 없음
- **테스트 통과**: 기존 테스트 모두 통과
- **성능 최적화**: 불필요한 리렌더링 방지
- **백워드 호환성**: 기존 API 인터페이스 유지

시니어 프론트엔드 개발자 수준의 깔끔하고 유지보수 가능한 코드로 리팩토링해드립니다!
