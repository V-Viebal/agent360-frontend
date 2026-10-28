export interface DocSection {
  id: string;
  title: string;
  category: string;
  badge?: string;
  summary: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  keyTakeaways: string[];
  sandboxPrompt?: string;
  sandboxOutput?: string[];
}

export const DOCS_SECTIONS: DocSection[] = [
  // 1. Getting Started
  {
    id: "quickstart",
    title: "Quickstart & Overview",
    category: "Getting Started",
    badge: "Core",
    summary:
      "Khởi chạy Skyer Agent Workstation: nền tảng vận hành Nhân viên AI độc lập trên hạ tầng AgentCore kết hợp điều phối đa tác nhân tự hành.",
    content: `
### Tổng quan về Skyer (AgentCore Kernel)
Skyer là nền tảng máy trạm nhân viên AI doanh nghiệp được xây dựng trên hạt nhân **AgentCore Kernel**. 
Không giống như các ứng dụng wrapper LLM thông thường chỉ đơn thuần phản hồi văn bản, mỗi nhân viên AI trong Skyer sở hữu một không gian làm việc máy trạm Linux hoàn chỉnh (\`/app/working\`), lưu trữ dữ liệu bền vững, trình điều khiển công cụ MCP và khả năng kết nối đa kênh tức thì.

### Các trụ cột kiến trúc cốt lõi
- **Không gian làm việc máy tính độc lập (Agent OS Container):** Mỗi nhân viên AI sở hữu một máy trạm Linux riêng biệt, có khả năng đọc ghi file, chạy lệnh shell, gọi API, thao tác trình duyệt Chromium CDP và lưu trữ tiến độ.
- **Tổ chức nhân sự AI đa tầng (Autonomous Hierarchy):** Phân chia rõ ràng giữa Agent Quản lý (Manager Lead) và các Agent Chuyên môn (Tài chính, Bán hàng, Kỹ thuật, Vận hành) phối hợp nhịp nhàng.
- **Cam kết không báo cáo ảo (Strict Verification Receipts):** Tác nhân bị chặn hoàn toàn khả năng tự nhận "hoàn thành" nếu không có bằng chứng thực thi: exit code lệnh thật, mã giao dịch, ảnh chụp màn hình kiểm chứng kết quả.
- **Cơ chế lưu trữ tri thức bền vững (ReMe Memory & Markdown):** Bộ nhớ dài hạn lưu trữ qua cấu trúc file chuẩn và hệ thống vector Wikilinks, không lo mất ngữ cảnh sau mỗi phiên làm việc.
    `,
    codeSnippet: {
      language: "bash",
      code: `# 1. Khởi động môi trường Skyer với AgentCore Kernel
git clone https://github.com/V-Viebal/agent360.git
cd agent360

# 2. Khởi chạy cụm dịch vụ qua Docker Compose
docker compose up -d

# 3. Kiểm tra danh sách kỹ năng và công cụ của nhân viên AI
curl -s http://localhost:5290/api/v1/agents/skills | jq .`,
    },
    keyTakeaways: [
      "Vận hành môi trường Linux cô lập cho từng nhân viên AI",
      "Điều phối công việc theo vai trò phòng ban chuyên biệt",
      "Kiểm chứng kết quả bằng biên nhận thực tế, loại bỏ hoàn toàn hoàn thành ảo",
    ],
    sandboxPrompt: "curl -s http://localhost:5290/api/v1/agents/skills | jq .",
    sandboxOutput: [
      "[sandbox.connect] Đang kết nối AgentCore kernel @ localhost:5290...",
      "[sandbox.skills] Đã kích hoạt 18 kỹ năng nghiệp vụ doanh nghiệp",
      "[sandbox.check] Trạng thái Kernel: Up (healthy) - Phân vùng /app/working đã gắn kết",
      "[sandbox.receipt] Phản hồi kiểm tra: HTTP 200 OK (độ trễ 12ms)",
    ],
  },
  {
    id: "core-concepts",
    sandboxPrompt: "skyer acp verify-topology --profile corporate-mesh",
    sandboxOutput: [
      "[topology.inspect] Khởi tạo sơ đồ giám sát cây điều phối đa tác nhân ACP...",
      "[topology.roles] Đã phát hiện 5 vai trò chuyên trách trực thuộc workspace",
      "[topology.contract] Giao thức ACP: Xác thực chữ ký số Ed25519 cho mỗi lượt giao việc",
      "[topology.status] Trạng thái: PASS (100% các nút trực tuyến, sẵn sàng nhận nhiệm vụ)",
    ],
    title: "Core Concepts",
    category: "Getting Started",
    badge: "Architecture",
    summary:
      "Tìm hiểu 6 thực thể cốt lõi trong Skyer: Nhân viên AI, Nhóm làm việc, Nhiệm vụ, Công cụ MCP, Bộ nhớ ReMe và Bằng chứng thực thi.",
    content: `
### 6 Thực thể kiến trúc cốt lõi trong Skyer

1. **Nhân viên AI (AI Teammate):** Một thực thể tự hành hoàn chỉnh với hồ sơ chức danh, vai trò phòng ban, hệ thống kỹ năng, bộ công cụ được cấp phép và không gian lưu trữ dữ liệu riêng biệt.
2. **Nhóm làm việc đa tác nhân (Multi-Agent Team):** Sự kết hợp giữa các nhân viên AI theo mô hình quy trình:
   - *Quy trình tuần tự (Sequential):* Luồng nghiệp vụ chuyển giao lần lượt từ chuyên viên này sang chuyên viên kế tiếp.
   - *Quy trình phân cấp (Hierarchical):* Tác nhân Trưởng phòng giám sát, phân bổ chỉ tiêu công việc, thẩm định biên bản và yêu cầu làm lại nếu chưa đạt.
3. **Nhiệm vụ & Mục tiêu (Task & Objective):** Đơn vị công việc cụ thể bao gồm dữ liệu đầu vào, tiêu chí nghiệm thu định lượng và tài liệu bàn giao bắt buộc.
4. **Cổng công cụ MCP (Model Context Protocol Gateway):** Cầu nối an toàn kết nối nhân viên AI với hệ điều hành Linux, cơ sở dữ liệu nội bộ, Google Workspace, ERPCore và trình duyệt headless.
5. **Hệ thống bộ nhớ ReMe (Dual-tier Memory):** Kết hợp các tệp chỉ dẫn chuẩn (\`MEMORY.md\`, \`AGENTS.md\`, \`SOUL.md\`) cho ngữ cảnh tức thời với cơ chế vector ReMe cho truy xuất dài hạn.
6. **Biên nhận nghiệm thu (Execution Receipt):** Bằng chứng thực nghiệm chứng minh tác vụ đã được hoàn thành (Exit code 0, HTTP 200 OK, mã hóa đơn ERP, ảnh chụp đối soát).
    `,
    keyTakeaways: [
      "Tách bạch rõ ràng giữa Danh tính, Quyền hạn và Môi trường thực thi",
      "Hỗ trợ cả quy trình tuần tự lẫn quy trình phân cấp có giám sát",
      "Bộ nhớ kết hợp hai tầng: Markdown tức thời và Vector ReMe dài hạn",
    ],
  },

  // 2. Core Components
  {
    id: "agents",
    sandboxPrompt: "skyer agent inspect --role financial-controller",
    sandboxOutput: [
      "[agent.manifest] Đang đọc hồ sơ năng lực: Kiểm Soát Viên Tài Chính (ERPCore)",
      "[agent.tools] Đã gắn 4 công cụ MCP: ERPCore, Bank Feed API, Excel AST, PayOS",
      "[agent.memory] Nạp hồ sơ ký ức /app/working/MEMORY.md (TT99 Standard)",
      "[agent.ready] Trạng thái: ONLINE (Container rootless ID #fc-9022, 200 OK)",
    ],
    title: "Agents & Roles",
    category: "Core Components",
    badge: "Specialization",
    summary:
      "Thiết lập nhân viên AI chuyên trách: vai trò phòng ban, mục tiêu công việc, mô hình suy luận và phân quyền công cụ.",
    content: `
### Giao việc đúng người, đúng chức danh
Thay vì dồn toàn bộ nghiệp vụ công ty vào một câu lệnh chat chung chung, Skyer yêu cầu định hình từng vị trí nhân sự AI rõ ràng.

#### Cấu trúc định nghĩa Nhân viên AI
\`\`\`yaml
agent_id: chief-of-staff
name: "Alex - Chánh Văn Phòng Điều Hành"
role: "Executive Operations & OKR Synthesis"
goal: "Tổng hợp chỉ số KPI các phòng ban, theo dõi điểm nghẽn và soạn thảo báo cáo ban điều hành."
backstory: "Trợ lý điều hành cấp cao với chuyên môn phân tích dữ liệu, quản trị tiến độ dự án và phối hợp liên phòng ban."
backend:
  runtime: "agentcore-native"
  model: "qwen-2.5-72b-instruct"
  temperature: 0.1
tools:
  - "google_workspace_mcp"
  - "erpcore_operations"
  - "plan_ledger_engine"
  - "slack_telegram_bridge"
memory:
  enabled: true
  persistence_path: "/app/working/workspaces/chief-of-staff"
\`\`\`
    `,
    codeSnippet: {
      language: "typescript",
      code: `import { Agent } from "@skyer/core";

export const chiefOfStaffAgent = new Agent({
  id: "chief-of-staff",
  name: "Alex - Chánh Văn Phòng",
  role: "Executive Operations",
  goal: "Tổng hợp báo cáo tuần từ Tài chính, Bán hàng và Vận hành",
  tools: ["erpcore", "google_workspace", "telegram"],
  allowDelegation: true,
  verbose: true,
});`,
    },
    keyTakeaways: [
      "Mỗi nhân viên AI có Persona, Mục tiêu và Không gian làm việc riêng biệt",
      "Giới hạn quyền công cụ theo đúng ma trận chức năng của phòng ban",
      "Hỗ trợ cấu hình linh hoạt mô hình ngôn ngữ cho từng vai trò",
    ],
  },
  {
    id: "ai-teammates",
    title: "Multi-Agent Workforce",
    category: "Core Components",
    badge: "Collaboration",
    summary:
      "Tổ chức đội ngũ nhân viên AI phối hợp làm việc: bàn giao công việc tự động, phản hồi thẩm định và kiểm soát chất lượng.",
    content: `
### Động cơ điều phối phân cấp (Supervision Engine)
Trong mô hình phân cấp, **Nhân viên Quản lý (Lead Manager)** nhận chỉ đạo tổng quan từ người dùng, tự động phân tích và giao việc cho các nhân viên chuyên trách:

\`\`\`
[ Chỉ đạo của Ban Giám Đốc ]
             ↓
[ Manager Lead (Chánh Văn Phòng) ]
             ├── [ Tác vụ 1: Đối soát 48 hóa đơn ] → Nhân viên Kế toán (ERPCore)
             ├── [ Tác vụ 2: Kiểm tra điều khoản pháp lý ] → Nhân viên Pháp chế
             └── [ Tác vụ 3: Đóng gói hồ sơ chi ] → Nhân viên Thanh toán
             ↓ (Tổng hợp biên nhận thực thi)
[ Cổng phê duyệt chữ ký số của CFO ]
\`\`\`

#### Lợi ích vượt trội
- **Phân công tự động:** Quản lý tự động chọn nhân viên có kỹ năng phù hợp nhất trong danh bạ.
- **Vòng lặp kiểm tra chất lượng:** Nếu nhân viên Pháp chế phát hiện hóa đơn thiếu phụ lục, nhiệm vụ sẽ bị trả về cho Kế toán kèm lưu ý điều chỉnh.
- **Fail-Closed An toàn tuyệt đối:** Mọi hành động nhạy cảm (thanh toán ngân hàng, sửa đổi hợp đồng) bắt buộc dừng lại tại cổng phê duyệt của con người.
    `,
    codeSnippet: {
      language: "python",
      code: `from skyer import AITeam, Process
from my_agents import manager_agent, accountant_agent, legal_agent

financial_team = AITeam(
    agents=[accountant_agent, legal_agent],
    manager_agent=manager_agent,
    process=Process.hierarchical,
    memory=True,
    verbose=True
)

result = financial_team.kickoff(inputs={
    "objective": "Đối soát 48 hóa đơn nhà cung cấp tuần 42 và lập tờ trình duyệt chi CFO"
})`,
    },
    keyTakeaways: [
      "Mô hình Trưởng phòng - Chuyên viên phản ánh cấu trúc thực tế của doanh nghiệp",
      "Cơ chế trả lại tác vụ tự động khi không đáp ứng tiêu chuẩn nghiệm thu",
      "Cổng phê duyệt của người quản lý trước khi thực thi các quyết định kinh doanh quan trọng",
    ],
    sandboxPrompt: "skyer team kickoff --team financial-audit --task 'Duyệt chi hóa đơn T10'",
    sandboxOutput: [
      "[manager] Tiếp nhận mục tiêu: 'Đối soát 48 hóa đơn và lập hồ sơ duyệt chi'",
      "[accountant] Đã đối soát 48/48 hóa đơn trên ERPCore: 0 sai lệch",
      "[legal] Thẩm định điều khoản hợp đồng TT99: Hợp lệ 100%",
      "[manager] Đóng gói biên bản nghiệm thu: Hồ sơ số #402 sẵn sàng cho CFO",
    ],
  },
  {
    id: "tasks",
    sandboxPrompt: "skyer task execute --id TASK-991 --dry-run",
    sandboxOutput: [
      "[task.init] Nhận lệnh: 'Kiểm tra chênh lệch 48 hóa đơn nhà cung cấp'",
      "[task.read] Quét bảng kê hóa đơn và phiếu kho: Không phát hiện sai lệch (0.00 VNĐ)",
      "[task.gate] Gặp lệnh duyệt chi $14,200 -> Kích hoạt Cổng Phê Duyệt Human Gate",
      "[task.receipt] Xuất biên nhận nghiệm thu hash #8f2a1b9c (Exit Code 0)",
    ],
    title: "Tasks & Verification",
    category: "Core Components",
    badge: "No Fake Done",
    summary:
      "Thiết lập hợp đồng giao việc minh bạch với yêu cầu đầu ra định lượng và biên nhận kiểm chứng rõ ràng.",
    content: `
### Đặc tả hợp đồng giao việc (Task Specification)
Mỗi nhiệm vụ trong Skyer là một cam kết thực thi có cấu trúc rõ ràng:
1. **Mô tả công việc (Description):** Định nghĩa cụ thể phạm vi và việc cần làm.
2. **Kết quả kỳ vọng (Expected Output):** Định dạng, cấu trúc và nội dung tài liệu bàn giao.
3. **Biên nhận nghiệm thu bắt buộc (Verification Requirements):** Tiêu chí kiểm chứng độc lập mà nhân viên AI phải cung cấp trước khi đánh dấu Đã xong.

#### Mẫu hợp đồng tác vụ chuẩn
\`\`\`yaml
task_id: "task-fin-402"
assigned_to: "accountant-bot"
description: "Đối soát danh sách 48 hóa đơn đầu vào tuần 42 so với đơn mua hàng PO trên ERPCore."
expected_output: "Bảng cân đối thanh toán đối soát và biên bản TT99 sẵn sàng trình duyệt."
verification_requirements:
  - "Exit code 0 từ kiểm tra đối soát ERPCore API"
  - "Tổng chênh lệch công nợ bằng $0.00"
  - "File biên nhận đối soát hợp lệ tại: .tmp/reconciliation-w42.json"
\`\`\`
    `,
    keyTakeaways: [
      "Mọi nhiệm vụ đều có điều kiện nghiệm thu định lượng cụ thể",
      "Ngăn chặn triệt để tình trạng nhân viên AI báo cáo ảo hoặc làm dở dang",
      "Nhật ký thực thi được ghi nhận bất biến vào sổ cái hệ thống",
    ],
  },

  // 3. AgentCore Runtime Architecture
  {
    id: "agentcore-sandbox",
    sandboxPrompt: "skyer sandbox audit --container-id sandbox-cos-01",
    sandboxOutput: [
      "[sandbox.audit] Kiểm tra cô lập hạ tầng: Linux Rootless Container (UID 1000)",
      "[sandbox.ebpf] Mạng nội bộ: eBPF Network Firewall bật, chặn toàn bộ kết nối ra ngoài",
      "[sandbox.volume] Phân vùng /app/working được mã hóa AES-256",
      "[sandbox.verdict] Đánh giá an toàn: Đạt chuẩn tuân thủ Nghị định 13/NĐ-CP & ISO-27001",
    ],
    title: "Kernel Sandbox & Security",
    category: "AgentCore Runtime",
    badge: "Security",
    summary:
      "Cơ chế bảo mật sâu của AgentCore: Container không quyền root, phân vùng làm việc độc lập và bộ lọc lệnh an toàn.",
    content: `
### Kiến trúc bảo mật & Cách ly máy trạm
Skyer kế thừa mô hình bảo vệ tài nguyên đa lớp của AgentCore:

- **Phân vùng làm việc cô lập (\`/app/working\`):** Nhân viên AI chỉ có toàn quyền đọc ghi trong thư mục phân bổ riêng, không can thiệp vào máy chủ chủ quản.
- **Bộ lọc kiểm soát thao tác phá hủy (Tool Guards):** Các câu lệnh có nguy cơ cao (xóa dữ liệu, sửa đổi cấu hình hệ thống, tải file lạ) tự động kích hoạt cảnh báo phê duyệt.
- **Quyền rootless an toàn:** Tiến trình container chạy không quyền root, loại bỏ nguy cơ leo thang đặc quyền hệ thống.
- **Giám sát tải và giới hạn luồng:** Ngăn chặn tình trạng treo vô tận hoặc ngốn CPU khi xử lý các tác vụ phân tích lớn.
    `,
    codeSnippet: {
      language: "bash",
      code: `# Cấu hình Container bảo mật cho Nhân viên AI Skyer
docker run -d \\
  --name skyer-agent-accountant \\
  --security-opt=no-new-privileges:true \\
  --cap-drop=ALL \\
  --pids-limit=100 \\
  -v /var/run/skyer/workspaces/accountant:/app/working \\
  skyer/agent-runtime:v2.2.1`,
    },
    keyTakeaways: [
      "Kiến trúc rootless container đảm bảo an toàn tuyệt đối cho hệ thống máy chủ",
      "Bộ chặn câu lệnh nguy hại bảo vệ dữ liệu doanh nghiệp",
      "Mỗi nhân viên AI được gắn với một phân vùng lưu trữ riêng biệt",
    ],
  },
  {
    id: "agentcore-memory",
    sandboxPrompt: "skyer memory query --query 'Chính sách duyệt chi tài chính'",
    sandboxOutput: [
      "[memory.search] Tìm kiếm trong đồ thị tri thức ReMe Vector DB...",
      "[memory.hit] Khớp 1 quy tắc bắt buộc: [[QuyĐịnhNhàCungCấp]] đối soát 3 bên PO/GRN",
      "[memory.hit] Khớp 1 ngưỡng duyệt: [[SLAThanhToán]] Báo CFO khi chi tiêu > $5,000",
      "[memory.sync] Đồng bộ thành công 2 chiều với Knowledge Base KB (Độ trễ 8ms)",
    ],
    title: "ReMe & Long-Term Memory",
    category: "AgentCore Runtime",
    badge: "Memory",
    summary:
      "Quy trình 6 bước nạp và duy trì ký ức doanh nghiệp của công nghệ ReMe, biến tương tác thành tri thức vĩnh viễn.",
    content: `
### Vòng đời 6 giai đoạn của bộ nhớ ReMe
Skyer không phụ thuộc vào lịch sử chat tạm bợ. Hệ thống xây dựng tri thức theo kiến trúc ReMe của AgentCore:

1. **Ghi nhận (Record):** Lắng nghe và ghi lại quy chuẩn công việc, chính sách công ty và kết quả đã được xác nhận.
2. **Tiếp nhận (Ingest):** Đọc và phân tích tài liệu nội bộ, thông báo chính sách và báo cáo tài chính.
3. **Sắp xếp (Organize):** Chắt lọc tri thức vào các tệp Markdown cấu trúc (\`MEMORY.md\`, \`AGENTS.md\`).
4. **Liên kết (Connect):** Thiết lập mạng lưới liên kết ngữ nghĩa giữa các văn bản bằng chuẩn Wikilinks (\`[[ChínhSáchChiTieu]]\`).
5. **Truy xuất (Retrieve):** Cơ chế tìm kiếm kép kết hợp từ khóa chính xác và vector ngữ nghĩa.
6. **Mở rộng (Expand):** Tự động nạp các mảnh ký ức liên quan vào ngữ cảnh khi nhân viên AI nhận nhiệm vụ mới.
    `,
    keyTakeaways: [
      "Ngăn nhân viên AI lặp lại sai lầm cũ hoặc quên chính sách của công ty",
      "Dữ liệu ký ức lưu trữ bằng định dạng Markdown minh bạch, dễ dàng kiểm toán",
      "Kết hợp tìm kiếm từ khóa với mạng lưới liên kết ngữ nghĩa chuyên sâu",
    ],
  },
  {
    id: "multi-channel",
    sandboxPrompt: "skyer gateway probe --channels 'web,telegram,slack'",
    sandboxOutput: [
      "[gateway.probe] Kiểm tra kết nối đa kênh theo thời gian thực...",
      "[gateway.web] Kênh Web Workspace: SSE streaming 60 FPS (Độ trễ 18ms)",
      "[gateway.telegram] Kênh Telegram Bot Webhook: 200 OK (Đã kết nối nhóm Điều hành)",
      "[gateway.auth] Bảo mật: JWT Token xác thực đa tầng, không lưu trữ thông tin nhạy cảm",
    ],
    title: "Multi-Channel Connectivity",
    category: "Enterprise Integration",
    badge: "Channels",
    summary:
      "Tích hợp nhân viên AI vào các kênh liên lạc doanh nghiệp: Telegram, Element/Matrix, Discord, Slack và Giao diện Web.",
    content: `
### Giao việc mọi lúc mọi nơi trên ứng dụng quen thuộc
Lãnh đạo và nhân viên có thể tương tác trực tiếp với các trợ lý AI trên các nền tảng chat phổ biến:

- **Telegram:** Trò chuyện trực tiếp, chia chủ đề trong Topic nhóm và hỗ trợ các nút bấm xác nhận lệnh tức thì.
- **Matrix / Element:** Mã hóa đầu cuối (E2EE) chuẩn quân đội dành cho các chỉ đạo cơ mật của ban lãnh đạo.
- **Discord & Slack:** Thông báo trạng thái tác vụ, theo dõi tiến độ và giao nhiệm vụ qua bot lệnh.
- **Web Console (/app):** Không gian làm việc đồ họa trực quan với đầy đủ công cụ quản trị và theo dõi thời gian thực.

#### Phân luồng thông minh theo Topic
Trong các nhóm chat có nhiều chủ đề (Forum Topics), Skyer tự động giữ vững ngữ cảnh độc lập theo từng chủ đề, không để lẫn lộn giữa các dự án.
    `,
    keyTakeaways: [
      "Nhân viên AI giao tiếp mượt mà ngay trên các ứng dụng chat hàng ngày của công ty",
      "Bảo toàn ngữ cảnh riêng biệt cho từng chủ đề và người phụ trách",
      "Hỗ trợ phê duyệt công việc nhanh qua nút bấm tương tác trên thiết bị di động",
    ],
  },
];
