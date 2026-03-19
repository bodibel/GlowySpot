"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useFilter } from "@/lib/filter-context"
import { getCategories } from "@/lib/actions/category"
import {
    Scissors,
    Sparkles,
    Hand,
    User,
    Palette,
    Waves,
    Smile,
    MapPin,
    Check,
    ChevronsUpDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocompleteNew from "@/lib/hooks/usePlacesAutocompleteNew"
import { getGeocode, getLatLng } from "use-places-autocomplete"
import { useEffect, useState } from "react"

// Icon mapping lookup
const ICON_MAP: Record<string, any> = {
    "Scissors": Scissors,
    "Sparkles": Sparkles,
    "Hand": Hand,
    "User": User,
    "Palette": Palette,
    "Waves": Waves,
    "Smile": Smile,
}

const EU_COUNTRIES = [
    { code: "HU", name: "Magyarország" },
    { code: "AT", name: "Ausztria" },
    { code: "DE", name: "Németország" },
    { code: "SK", name: "Szlovákia" },
    { code: "RO", name: "Románia" },
    { code: "HR", name: "Horvátország" },
    { code: "SI", name: "Szlovénia" },
]

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
}

const RATINGS = [3.5, 4.0, 4.5]
const MAP_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"]

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
    const {
        location,
        filters,
        updateLocation,
        updateFilters,
        addServiceFilter,
        removeServiceFilter,
        clearFilters
    } = useFilter()

    const [isCountryOpen, setIsCountryOpen] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        const loadCategories = async () => {
            const fetched = await getCategories()
            setCategories(fetched)
        }
        loadCategories()
    }, [])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: MAP_LIBRARIES,
    })

    const selectedCountryCode = EU_COUNTRIES.find(c => c.name === location.country)?.code || "HU"

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocompleteNew({
        requestOptions: {
            componentRestrictions: { country: selectedCountryCode.toLowerCase() },
            types: ["(cities)"],
        },
        debounce: 300,
        defaultValue: location.city,
        initOnMount: isLoaded
    })

    // Update value when location.city changes from outside
    useEffect(() => {
        setValue(location.city, false)
    }, [location.city, setValue])

    const handleSelect = async (description: string) => {
        setValue(description, false)
        clearSuggestions()

        try {
            const results = await getGeocode({ address: description })
            const { lat, lng } = await getLatLng(results[0])

            // Extract city from result
            const cityComponent = results[0].address_components.find(c =>
                c.types.includes("locality") || c.types.includes("postal_town")
            )

            updateLocation({
                city: cityComponent?.long_name || description.split(',')[0],
                lat,
                lng
            })
        } catch (error) {
            console.error("Error geocoding city:", error)
        }
    }

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

                <div className="grid gap-6 py-4">
                    {/* Location & Radius */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Távolság és Helyszín</Label>

                        <div className="grid gap-2">
                            <Label className="text-sm font-normal text-muted-foreground">Ország</Label>
                            <Popover open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isCountryOpen}
                                        className="w-full justify-between font-normal"
                                    >
                                        {location.country || "Válassz országot"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                        <CommandInput placeholder="Ország keresése..." />
                                        <CommandEmpty>Nincs találat.</CommandEmpty>
                                        <CommandList>
                                            <CommandGroup>
                                                {EU_COUNTRIES.map((country) => (
                                                    <CommandItem
                                                        key={country.code}
                                                        value={country.name}
                                                        onSelect={(currentValue) => {
                                                            updateLocation({
                                                                country: currentValue,
                                                                city: "",
                                                                lat: undefined,
                                                                lng: undefined
                                                            })
                                                            setIsCountryOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                location.country === country.name ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {country.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-2 relative">
                            <Label htmlFor="city" className="text-sm font-normal text-muted-foreground">Város</Label>
                            <div className="relative">
                                <Input
                                    id="city"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Kezdj el gépelni egy várost..."
                                    disabled={!ready}
                                    className="pr-10"
                                />
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>

                            {status === "OK" && (
                                <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-50 mt-1 max-h-40 overflow-y-auto">
                                    {data.map(({ place_id, description }) => (
                                        <div
                                            key={place_id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            onClick={() => handleSelect(description)}
                                        >
                                            {description}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-normal text-muted-foreground">Keresési sugár</Label>
                                <span className="text-sm font-medium">{location.radius} km</span>
                            </div>
                            <Slider
                                value={[location.radius]}
                                onValueChange={(vals) => updateLocation({ radius: vals[0] })}
                                max={50}
                                min={1}
                                step={1}
                                className="py-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1 km</span>
                                <span>10 km</span>
                                <span>25 km</span>
                                <span>50 km</span>
                            </div>
                        </div>
                    </div>

                    {/* Service Categories */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Szolgáltatások</Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => {
                                const isSelected = filters.services.includes(cat.slug)
                                const Icon = ICON_MAP[cat.icon || ""] || Sparkles
                                return (
                                    <Badge
                                        key={cat.id}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`cursor-pointer px-3 py-2 text-sm gap-2 transition-all ${isSelected ? "bg-primary hover:bg-primary/90" : "hover:bg-accent"
                                            }`}
                                        onClick={() =>
                                            isSelected
                                                ? removeServiceFilter(cat.slug)
                                                : addServiceFilter(cat.slug)
                                        }
                                    >
                                        <Icon className="w-4 h-4" />
                                        {cat.name}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
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
