'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CarouselProps = {
    opts?: object;
    plugins?: never[];
    orientation?: 'horizontal' | 'vertical';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setApi?: (api: any) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error('useCarousel must be used within a <Carousel />');
    }

    return context;
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            axis: orientation === 'horizontal' ? 'x' : 'y',
        },
        plugins ?? []
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const contextValue = React.useMemo(
        () => ({
            carouselRef,
            api,
            opts,
            orientation: orientation || 'horizontal',
            scrollPrev: () => api?.scrollPrev(),
            scrollNext: () => api?.scrollNext(),
            canScrollPrev,
            canScrollNext,
            setApi,
        }),
        [api, canScrollNext, canScrollPrev, carouselRef, orientation, opts, setApi]
    );

    const onSelect = React.useCallback(() => {
        if (!api) return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, [api]);

    React.useEffect(() => {
        if (!api) return;

        setApi?.(api);
        onSelect();
        api.on('reInit', onSelect);
        api.on('select', onSelect);

        // eslint-disable-next-line consistent-return
        return () => {
            api.off('select', onSelect);
            api.off('reInit', onSelect);
        };
    }, [api, onSelect, setApi]);

    return (
        <CarouselContext.Provider value={contextValue}>
            <div
                ref={ref}
                className={cn(
                    'relative',
                    orientation === 'horizontal' ? 'w-full' : 'h-full',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
});
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { orientation } = useCarousel();

        return (
            <div
                ref={ref}
                className={cn(
                    'overflow-hidden',
                    orientation === 'horizontal' ? '-mx-4' : '-my-4',
                    className
                )}
                {...props}
            />
        );
    }
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { orientation } = useCarousel();

        return (
            <div
                ref={ref}
                role='group'
                aria-roledescription='slide'
                className={cn(
                    'min-w-0 shrink-0 grow-0 basis-full',
                    orientation === 'horizontal' ? 'pl-4' : 'pt-4',
                    className
                )}
                {...props}
            />
        );
    }
);
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
    ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
        const { orientation, scrollPrev, canScrollPrev } = useCarousel();

        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={cn(
                    'absolute h-8 w-8 rounded-full',
                    orientation === 'horizontal'
                        ? '-left-12 top-1/2 -translate-y-1/2'
                        : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                    className
                )}
                disabled={!canScrollPrev}
                onClick={scrollPrev}
                {...props}
            >
                <ArrowLeft className='h-4 w-4' />
                <span className='sr-only'>Previous slide</span>
            </Button>
        );
    }
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
    ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
        const { orientation, scrollNext, canScrollNext } = useCarousel();

        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={cn(
                    'absolute h-8 w-8 rounded-full',
                    orientation === 'horizontal'
                        ? '-right-12 top-1/2 -translate-y-1/2'
                        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                    className
                )}
                disabled={!canScrollNext}
                onClick={scrollNext}
                {...props}
            >
                <ArrowRight className='h-4 w-4' />
                <span className='sr-only'>Next slide</span>
            </Button>
        );
    }
);
CarouselNext.displayName = 'CarouselNext';

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious };
