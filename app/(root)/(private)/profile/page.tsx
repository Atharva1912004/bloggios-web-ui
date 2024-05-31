export default function ProfilePage() {
    return (
        <main className={"max-w-screen-xl container flex mt-6 md:10 flex-col lg:flex-row md:justify-center"}>
            <div className={"w-full lg:w-[30%] md:w-[50%] bg-red-200 self-center"}>
                Profile Card
            </div>

            <div className={"w-full lg:w-[70%] bg-amber-700"}>
                Details
            </div>
        </main>
    )
}