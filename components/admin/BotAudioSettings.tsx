'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Loader2, Trash2, Play, Pause, Mic, Music } from 'lucide-react';

interface AudioCardProps {
  title: string;
  description: string;
  settingKey: 'greetingAudioUrl' | 'productAudioUrl';
  icon: React.ReactNode;
  currentUrl: string;
  onSaved: (key: string, url: string) => void;
}

function AudioCard({ title, description, settingKey, icon, currentUrl, onSaved }: AudioCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const displayUrl = pendingUrl ?? currentUrl;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file (mp3, wav, etc.)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setPendingUrl(data.url);
      toast.success('Audio uploaded — click Save to apply');
    } catch {
      toast.error('Failed to upload audio file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!pendingUrl) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/bot-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [settingKey]: pendingUrl }),
      });
      if (!res.ok) throw new Error();
      onSaved(settingKey, pendingUrl);
      setPendingUrl(null);
      toast.success(`${title} saved successfully`);
    } catch {
      toast.error('Failed to save setting');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/bot-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [settingKey]: '' }),
      });
      if (!res.ok) throw new Error();
      onSaved(settingKey, '');
      setPendingUrl(null);
      toast.success('Audio removed');
    } catch {
      toast.error('Failed to remove audio');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePlay = () => {
    if (!displayUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(displayUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.src = displayUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const fileName = displayUrl
    ? decodeURIComponent(displayUrl.split('/').pop() ?? 'audio').replace(/^\d+_/, '')
    : null;

  return (
    <Card className={pendingUrl ? 'border-amber-400 dark:border-amber-500' : ''}>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current audio display */}
        {displayUrl ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <button
              onClick={togglePlay}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{fileName}</p>
              <p className="text-[10px] text-muted-foreground">
                {pendingUrl ? '⚠ Unsaved — click Save to apply' : '✓ Active'}
              </p>
            </div>
            <button
              onClick={handleRemove}
              disabled={isSaving}
              className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              title="Remove audio"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed text-muted-foreground text-xs">
            <Music className="w-4 h-4" />
            No audio set
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-3.5 h-3.5 mr-2" /> Upload MP3</>
            )}
          </Button>

          {pendingUrl && (
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </CardContent>
    </Card>
  );
}

// ── Main exported component ───────────────────────────────────

interface BotAudioSettingsProps {
  initialSettings: Record<string, string>;
}

export function BotAudioSettings({ initialSettings }: BotAudioSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);

  const handleSaved = (key: string, url: string) => {
    setSettings((prev) => ({ ...prev, [key]: url }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-violet-500" />
          Voice Messages
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload MP3 files that play automatically in Messenger conversations.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <AudioCard
            title="Greeting Audio"
            description="Plays before the product carousel (main menu)"
            settingKey="greetingAudioUrl"
            icon={<Music className="w-4 h-4" />}
            currentUrl={settings.greetingAudioUrl ?? ''}
            onSaved={handleSaved}
          />
          <AudioCard
            title="Product Selection Audio"
            description="Plays when a customer selects a product (before color images)"
            settingKey="productAudioUrl"
            icon={<Mic className="w-4 h-4" />}
            currentUrl={settings.productAudioUrl ?? ''}
            onSaved={handleSaved}
          />
        </div>
      </CardContent>
    </Card>
  );
}
