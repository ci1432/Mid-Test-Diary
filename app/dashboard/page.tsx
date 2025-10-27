"use client"

import * as React from "react"
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { Calendar } from "@/components/ui/calendar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { DiaryEditor } from "@/components/DiaryEditor"; // DiaryEditor import 확인

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const router = useRouter();

  // 사용자가 로그인했는지 확인
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/'); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Diary</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      {/* 캘린더 및 에디터 코드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        
        {/* --- ★★★ 이 부분이 수정되었습니다! ★★★ --- */}
        <div>
          {/* <p> 태그를 삭제하고 DiaryEditor를 보여줍니다. */}
          <DiaryEditor selectedDate={selectedDate} />
        </div>
        {/* --- ★★★ 여기까지 ★★★ --- */}

      </div>
    </div>
  );
}