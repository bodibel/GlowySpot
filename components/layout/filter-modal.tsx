"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/lib/filter-context"
import { FilterPanel } from "@/components/layout/filter-panel"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { clearFilters } = useFilter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Szűrők</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Alaphelyzet
          </Button>
        </DialogHeader>

        <div className="py-4">
          <FilterPanel />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sticky bottom-0 bg-background pt-2 border-t mt-auto">
          <Button variant="outline" onClick={onClose}>
            Mégse
          </Button>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Szűrés alkalmazása
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
