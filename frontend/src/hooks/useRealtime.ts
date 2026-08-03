import { useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  channelId: string;
  content: string;
  userId: string;
  createdAt: string;
}

interface TypingUser {
  userId: string;
  userName: string;
}

// Hook for real-time messages in a channel
export function useRealtimeMessages(channelId?: string) {
  const { socket, isConnected, joinChannel, leaveChannel } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected || !channelId) return;

    // Join the channel
    joinChannel(channelId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      if (message.channelId === channelId) {
        // Update messages cache
        queryClient.invalidateQueries({ queryKey: ['channel-messages', channelId] });
      }
    };

    socket.on('newMessage', handleNewMessage);

    // Cleanup
    return () => {
      socket.off('newMessage', handleNewMessage);
      leaveChannel(channelId);
    };
  }, [socket, isConnected, channelId, joinChannel, leaveChannel, queryClient]);
}

// Hook for typing indicators
export function useTypingIndicators(channelId?: string) {
  const { socket, isConnected } = useSocket();
  const [typingUsers, setTypingUsers] = React.useState<TypingUser[]>([]);

  useEffect(() => {
    if (!socket || !isConnected || !channelId) return;

    const handleUserTyping = (data: TypingUser) => {
      setTypingUsers(prev => {
        // Remove if already exists, then add
        const filtered = prev.filter(u => u.userId !== data.userId);
        return [...filtered, data];
      });

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }, 3000);
    };

    const handleUserStoppedTyping = (data: { userId: string }) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
    };

    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [socket, isConnected, channelId]);

  return typingUsers;
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = (notification: any) => {
      // Invalidate notifications cache
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, isConnected, queryClient]);
}

// Hook for real-time task updates
export function useRealtimeTaskUpdates(projectId?: string) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected || !projectId) return;

    // Join project room
    socket.emit('joinProject', { projectId });

    const handleTaskUpdate = (task: any) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    };

    socket.on('taskUpdated', handleTaskUpdate);

    return () => {
      socket.off('taskUpdated', handleTaskUpdate);
      socket.emit('leaveProject', { projectId });
    };
  }, [socket, isConnected, projectId, queryClient]);
}

// Hook for real-time project updates
export function useRealtimeProjectUpdates() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProjectUpdate = (project: any) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', project.id] });
    };

    socket.on('projectUpdated', handleProjectUpdate);

    return () => {
      socket.off('projectUpdated', handleProjectUpdate);
    };
  }, [socket, isConnected, queryClient]);
}

// Custom hook for sending typing indicators with debounce
export function useTyping(channelId?: string, userName?: string) {
  const { sendTyping, stopTyping } = useSocket();
  const [isTyping, setIsTyping] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTyping = useCallback(() => {
    if (!channelId || !userName) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTyping(channelId, userName);
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(channelId);
    }, 2000);
  }, [channelId, userName, isTyping, sendTyping, stopTyping]);

  const handleStopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isTyping && channelId) {
      setIsTyping(false);
      stopTyping(channelId);
    }
  }, [isTyping, channelId, stopTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { handleTyping, handleStopTyping };
}

// Add React import for useState and useRef
import React from 'react';
