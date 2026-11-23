export type LinkItem = {
  id: string;
  title: string;
  url: string;
  description?: string;
};

export type Profile = {
  name: string;
  bio: string;
  image: string;
  links: LinkItem[];
};

// TODO: 아래는 보여 주기용 더미 값입니다. 진짜 내용으로 교체하세요.
// - image: 내 사진을 public/ 폴더에 넣고 경로를 바꾸세요 (예: "/me.jpg")
// - links: id는 클릭 수 집계 키로 쓰이니 한 번 정하면 바꾸지 않는 것이 좋습니다.
export const profile: Profile = {
  name: "김클로",
  bio: "세계 최강 바이브코더",
  image: "/profile.svg",
  links: [
    {
      id: "github",
      title: "GitHub",
      url: "https://github.com",
      description: "내가 만든 프로젝트들",
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      url: "https://www.linkedin.com",
      description: "경력과 이력",
    },
    {
      id: "blog",
      title: "Blog",
      url: "https://example.com",
      description: "개발 일지와 회고",
    },
  ],
};
