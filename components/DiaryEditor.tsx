"use client"

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { auth, db } from "@/lib/firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

interface DiaryEditorProps {
  selectedDate: Date | undefined;
}

// ★★★ UTC 버그가 해결된 formatDate 함수 ★★★
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function DiaryEditor({ selectedDate }: DiaryEditorProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 선택된 날짜가 바뀌면 Firestore에서 해당 날짜의 일기를 불러오기
  useEffect(() => {
    if (!selectedDate || !user) {
      setContent(""); 
      return;
    }

    const loadDiary = async () => {
      setLoading(true);
      const dateId = formatDate(selectedDate); // 수정된 함수 사용
      
      const docRef = doc(db, "users", user.uid, "diaries", dateId);
      
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContent(docSnap.data().content); 
      } else {
        setContent(""); 
      }
      setLoading(false);
    };

    loadDiary();
  }, [selectedDate, user]); 

  // 일기 저장 핸들러
  const handleSave = async () => {
    if (!selectedDate || !user) {
      alert("날짜를 선택하거나 로그인해야 합니다.");
      return;
    }

    setLoading(true);
    const dateId = formatDate(selectedDate); // 수정된 함수 사용
    const docRef = doc(db, "users", user.uid, "diaries", dateId);

    try {
      await setDoc(docRef, { 
        content: content,
        date: dateId 
      });
      alert("일기가 저장되었습니다!");
    } catch (error) {
      console.error("저장 오류:", error);
      alert("일기 저장에 실패했습니다.");
    }
    setLoading(false);
  };

  // 날짜가 선택되지 않았을 때의 UI
  if (!selectedDate) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>일기</CardTitle>
        </CardHeader>
        <CardContent>
          <p>달력에서 날짜를 선택해주세요.</p>
        </CardContent>
      </Card>
    );
  }

  // 날짜가 선택되었을 때의 UI
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>일기: {formatDate(selectedDate)}</CardTitle> 
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="오늘 하루는 어땠나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          disabled={loading || !user}
        />
        <Button onClick={handleSave} disabled={loading || !user} className="mt-4">
          {loading ? "저장 중..." : "일기 저장"}
        </Button>
      </CardContent>
    </Card>
  );
}