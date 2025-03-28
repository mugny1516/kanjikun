// import { NextRequest, NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";
// import crypto from "crypto";

// export async function POST(request: NextRequest) {
//   const requestSignature = request.headers.get("X-MICROCMS-Signature");
//   const expectedSecret = process.env.MICROCMS_REVALIDATION_SECRET;
//   const requestBody = await request.text();

//   if (!requestSignature || !expectedSecret) {
//     console.warn("Webhook: シークレットが見つかりません。");
//     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//   }

//   const signature = crypto
//     .createHmac("sha256", expectedSecret)
//     .update(requestBody)
//     .digest("hex");

//   try {
//     if (
//       !crypto.timingSafeEqual(
//         Buffer.from(requestSignature),
//         Buffer.from(signature)
//       )
//     ) {
//       console.warn("Webhook: 不正なシグネチャです。");
//       return NextResponse.json(
//         { message: "Invalid signature" },
//         { status: 401 }
//       );
//     }
//   } catch (error) {
//     console.warn("Webhook: シグネチャの比較中にエラーが発生しました。", error);
//     return NextResponse.json(
//       { message: "Invalid signature format" },
//       { status: 400 }
//     );
//   }

//   try {
//     const body = JSON.parse(requestBody);
//     console.log("再検証Webhook受信:", body);

//     const api = body?.api;
//     const id = body?.id || body?.contents?.new?.id || body?.contents?.old?.id;

//     if (api !== "blog" || !id) {
//       console.log("Webhook無視: 対象APIでないか、IDがありません。");
//       return NextResponse.json({
//         message: "Webhook ignored (not a target API or missing ID)",
//       });
//     }

//     const articlePath = `/articles/${id}`;
//     const listPath = "/articles";

//     console.log(`再検証実行: ${articlePath}`);
//     console.log(`再検証実行: ${listPath}`);

//     revalidatePath(articlePath);
//     revalidatePath(listPath);

//     return NextResponse.json({
//       revalidated: true,
//       now: Date.now(),
//       paths: [articlePath, listPath],
//     });
//   } catch (error) {
//     console.error("再検証Webhookの処理中にエラー:", error);
//     return NextResponse.json(
//       {
//         message: `Webhook error: ${
//           error instanceof Error ? error.message : "不明なエラー"
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// }
