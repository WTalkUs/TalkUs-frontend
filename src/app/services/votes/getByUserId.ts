import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { auth } from "@/app/lib/firebase";

interface GetUserVoteSuccess {
  success: true;
  data: {
    vote_id: string;
    user_id: string;
    post_id: string;
    type: "like" | "dislike";
    created_at: string;
    updated_at: string;
  };
}

interface GetUserVoteNotFound {
  success: false;
  error: "not_found";
}

interface GetUserVoteError {
  success: false;
  error: string;
  status?: number;
}

export type GetUserVoteResponse =
  | GetUserVoteSuccess
  | GetUserVoteNotFound
  | GetUserVoteError;

export const getUserVote = async (
  postId: string
): Promise<GetUserVoteResponse> => {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }
  try {
    const url = `/public/votes/user?post_id=${postId}&user_id=${user.uid}`;

    const response = await api.get(url, {
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404) {
        return { success: false, error: "not_found" };
      }
      return {
        success: false,
        error:
          (err.response?.data as string) || "Error consulting user vote",
        status,
      };
    }
    return {
      success: false,
      error: (err as Error).message,
    };
  }
};