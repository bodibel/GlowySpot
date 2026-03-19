"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommentsPage() {
    return (
        <MainLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Hozzászólásaim</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Nincsenek hozzászólások</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Ez a funkció hamarosan elérhető lesz.</p>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}
