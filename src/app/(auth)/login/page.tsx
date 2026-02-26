'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Button from '@/shared/ui/button';
import Card from '@/shared/ui/card';
import Input from '@/shared/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다. 아이디를 확인해주세요.');
      }

      router.push('/reports');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '로그인에 실패했습니다. 아이디를 확인해주세요.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-12 md:grid md:grid-cols-2 md:gap-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StreamBoard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              대시보드에 로그인
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              실시간 협업 리포트 작성 및 분석 대시보드
            </p>
          </div>

          <Card>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-slate-200">
                  아이디
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  hasError={Boolean(error)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  비밀번호
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error ? (
                <div
                  id="login-error"
                  role="alert"
                  className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
                >
                  {error}
                </div>
              ) : null}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-xs text-slate-500">
            개발용(Stub) 로그인입니다. 실제 서비스(프로덕션)에서는 비활성화됩니다.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                대시보드 미리보기
              </span>
              <p className="mt-2 text-xs text-slate-400">
                아래 화면은 예시 데이터로 구성된 데모 화면입니다.
              </p>
            </div>
            <Card className="p-4">
              <p className="text-xs text-slate-400">리포트 현황 (예시)</p>
              <p className="mt-2 text-2xl font-semibold text-white">예시 수치</p>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
                <div className="h-2 w-2/3 rounded-full bg-cyan-400/70" />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400">협업 사용자 현황 (예시)</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg border border-slate-800/70 bg-slate-900/60" />
                <div className="h-12 rounded-lg border border-slate-800/70 bg-slate-900/60" />
                <div className="h-12 rounded-lg border border-slate-800/70 bg-slate-900/60" />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400">시스템 상태 (예시)</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-200">데모 상태 표시</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
