export const notification=(text, link)=>{
    return `
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
            </head>
            <body class="h-[70vh] w-full ">
                <div class="h-full w-fullflex justify-center items-center">
                    <div class="flex flex-col gap-4 justify-center items-center w-full h-screen">
                        <h1 class="text-xl font-semibold uppercase">TEST - Declaration d'incident</h1>
                        <div class="shadow border rounded-lg w-[300px] min-h-[200px] overflow-hidden border-gray-100">
                            <!-- Header -->
                            <div class="flex justify-center items-center p-2 bg-gray-200">
                                <img src="https://www.bfclimited.com/wp-content/uploads/2024/07/Logo4.png" alt="bfc limited logo" class="w-[50px]">
                            </div>

                            <!-- Body -->
                            <div class="p-6 flex flex-col text-sm/8 text-zinc-600 lead-">
                                <p style="font-family:sans-serif; font-size: 15px; color:#262626">${text}</p>
                            </div>

                            <!-- Footer -->
                            <div class="flex justify-center items-center p-4">
                                <a href="${link}" target="_blank" class="p-2 shadow bg-blue-950 hover:bg-blue-800 rounded-lg text-white text-xs transition-all">Ouvrir l'outil de gestion des incidents</a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
}