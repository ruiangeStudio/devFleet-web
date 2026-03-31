export default {
  nav: {
    features: '특징',
    screenshots: '스크린샷',
    download: '다운로드',
    github: 'GitHub',
    cta: '지금 다운로드',
  },
  hero: {
    badge: '오픈 소스 - 크로스 플랫폼 데스크톱 앱',
    title: `프런트엔드 프로젝트 관리
이전과는 다른 방식`,
    desc: 'DevFleet은 프로젝트 관리, 노드 버전 전환, 스크립트 실행, 에디터 통합을 결합한 올인원 데스크톱 워크스테이션으로, 프론트엔드 개발자를 위해 제작되었습니다.',
    download: '무료 다운로드',
    platforms: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
  },
  features: {
    label: '특징',
    title: '프론트엔드 개발자용으로 제작',
    desc: '프로젝트 관리부터 노드 버전 전환, 스크립트 실행, 에디터 통합에 이르기까지 DevFleet은 일상적인 개발 워크플로 전반을 지원합니다.',
    items: [
      {
        icon: '📦',
        title: '프로젝트 관리',
        description: 'package.json이 있는 폴더를 선택하여 프로젝트를 추가합니다. npm 스크립트 및 패키지 관리자(npm / yarn / pnpm / bun)를 자동으로 감지합니다. 이름 또는 경로로 빠른 검색을 지원합니다.',
      },
      {
        icon: '🎯',
        title: '노드 버전 관리',
        description: 'nvmd, nvs, nvm 및 nvm-windows를 지원합니다. 프로젝트별로 독립적인 노드 버전을 할당할 수 있습니다. 자동 생성된 구성 파일을 사용하여 원클릭으로 설치, 전환 또는 제거할 수 있습니다.',
      },
      {
        icon: '🚀',
        title: '스크립트 런처',
        description: '외부 터미널 또는 앱 내 관리 모드에서 스크립트를 실행합니다. Windows PowerShell, macOS 터미널 및 Linux에 대한 크로스 플랫폼 지원. 패키지 관리자를 기반으로 자동 생성된 명령.',
      },
      {
        icon: '💻',
        title: '에디터 통합',
        description: '한 번의 클릭으로 VSCode, Cursor 또는 WebStorm에서 프로젝트를 열 수 있습니다. 설치된 편집기를 자동으로 감지하고 기본 편집기 환경 설정을 지원합니다.',
      },
      {
        icon: '🎨',
        title: 'UI 및 경험',
        description: '기본 창 컨트롤이 포함된 프레임 없는 사용자 지정 제목 표시줄. 밝은 테마와 어두운 테마를 자유롭게 전환할 수 있습니다. 키보드 단축키. 컴포넌트 충돌을 방지하는 오류 경계 보호 기능.',
      },
      {
        icon: '⚡',
        title: '자동 업데이트',
        description: '앱에서 새 버전을 확인하세요. 한 번의 클릭으로 다운로드 및 설치. 안전하고 신뢰할 수 있는 업데이트를 위해 서명 확인 기능이 있는 Tauri Updater를 기반으로 합니다.',
      },
    ],
  },
  screenshots: {
    label: '스크린샷',
    title: '우아하고 강력한 데스크톱 경험',
    desc: '밝고 어두운 테마 전환이 매끄럽게 이루어지는 세심하게 디자인된 UI로 개발이 즐거워집니다.',
    tabs: [
      '프로젝트',
      '노드 버전',
      '버전 세부 정보',
      '자동 업데이트',
      '조명 모드',
    ],
  },
  cta: {
    label: '다운로드',
    title: '개발 환경을 레벨업할 준비가 되셨나요?',
    desc: 'DevFleet은 완전 무료 오픈 소스입니다. Windows, macOS 및 Linux에서 사용할 수 있습니다.',
    windows: 'Windows용 다운로드',
    macos: 'MacOS용 다운로드',
    linux: 'Linux용 다운로드',
  },
  footer: {
    copyright: '© 2026 DevFleet. 모든 권리 보유.',
    feedback: '피드백',
    changelog: '변경 로그',
  },
}
