export const notification=()=>{
    return `
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
            </head>
            <body>
                <div class="flex flex-col gap-4 justify-center items-center w-full h-screen">
                    <h1 class="text-xl font-semibold uppercase">Declaration d'incident</h1>
                    <div class="shadow border rounded-lg w-[300px] min-h-[200px] overflow-hidden border-gray-100">
                        <!-- Header -->
                        <div class="flex justify-center items-center p-2 bg-gray-200">
                            <img src="https://www.bfclimited.com/wp-content/uploads/2024/07/Logo4.png" alt="bfc limited logo" class="w-[100px]">
                        </div>

                        <!-- Body -->
                        <div class="p-6 flex flex-col text-sm/8 text-zinc-600 lead-">
                            <p>Un nouvel incident a été déclaré</p>
                            <p><span class="font-bold">Initiateur :</span> nom de l'initiateur</p>
                            <p><span class="font-bold">Email :</span> email de l'initiateur</p>
                            <p><span class="font-bold">Type d'incident :</span> le type d'incident</p>
                            <p><span class="font-bold">Type d'incident :</span> nom de l'initiateur</p>
                        </div>

                        <!-- Footer -->
                        <div class="flex justify-center items-center p-4">
                            <a href="" target="_blank" class="p-2 shadow bg-blue-950 hover:bg-blue-800 rounded-lg text-white text-xs transition-all">Ouvrire gestion des incidents</a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
}