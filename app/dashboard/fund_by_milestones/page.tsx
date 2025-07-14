'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    DollarSign,
    Globe,
    Image,
    Plus,
    User,
} from 'lucide-react';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DashboardNav } from '@/components/organisms/navigation/DashboardNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { AuthStates, MilestoneForm, MilestoneSummary } from '../../../components/organisms/funding';
import { ANIMATIONS, CATEGORIES, VALIDATION_LIMITS } from '../../../constants/create_round';
import { useAuth } from '../../../hooks/useAuth';
import { useProjectSubmission } from '../../../hooks/useProjectSubmission';
import { type ProjectFormData, projectSchema } from '../../../types/create_round';

export default function FundProjectPage() {
    const { ready, authenticated, connectedWallet, handleAuthenticate } = useAuth();
    const { isSubmitting, transactionHash, handleSubmit } = useProjectSubmission();

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            coverUrl: '',
            projectName: '',
            description: '',
            website: '',
            category: '',
            fundingGoal: '',
            fundingDeadline: '',
            milestones: [
                {
                    title: '',
                    description: '',
                    deadline: '',
                    fundingAmount: '',
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'milestones',
    });

    const onSubmit = async (data: ProjectFormData): Promise<void> => {
        if (!ready) {
            toast.error('Privy is not ready yet, please wait');
            return;
        }

        if (!authenticated) {
            toast.error('Please authenticate with Privy first');
            return;
        }

        if (!connectedWallet) {
            toast.error('No wallet connected. Please connect a wallet first');
            return;
        }

        await handleSubmit(data, connectedWallet);
    };

    const addMilestone = () => {
        if (fields.length >= VALIDATION_LIMITS.MAX_MILESTONES) {
            toast.error(`Maximum ${VALIDATION_LIMITS.MAX_MILESTONES} milestones allowed`);
            return;
        }
        append({
            title: '',
            description: '',
            deadline: '',
            fundingAmount: '',
        });
    };

    const removeMilestone = (index: number) => {
        if (fields.length > VALIDATION_LIMITS.MIN_MILESTONES) {
            remove(index);
        } else {
            toast.error(`At least ${VALIDATION_LIMITS.MIN_MILESTONES} milestone is required`);
        }
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    // Show loading state if not ready
    if (!ready) {
        return <AuthStates.LoadingState />;
    }

    // Show authentication prompt if not authenticated
    if (!authenticated) {
        return <AuthStates.NotAuthenticatedState onAuthenticate={handleAuthenticate} />;
    }

    // Show wallet connection prompt if no wallet connected
    if (!connectedWallet) {
        return <AuthStates.NoWalletState onAuthenticate={handleAuthenticate} />;
    }

    return (
        <div className='min-h-screen bg-green-50'>
            <DashboardNav />

            <div className='max-w-5xl mx-auto py-10 md:py-16 px-2 sm:px-4'>
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={ANIMATIONS.fadeInUp}
                >
                    <div className='text-center mb-8'>
                        <div className='flex justify-center mb-4'>
                            <Link href='/dashboard/projects'>
                                <Button
                                    variant='ghost'
                                    size='lg'
                                    className='border-gray-200 hover:bg-gray-50 hover:border-gray-400 text-gray-700 px-6 py-2 text-base font-semibold flex items-center gap-2'
                                >
                                    <ArrowLeft className='h-5 w-5' />
                                    Back to Projects
                                </Button>
                            </Link>
                        </div>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight'>
                            Fund Your Project
                        </h1>
                        <p className='text-base sm:text-lg md:text-xl mb-4 max-w-2xl mx-auto'>
                            Create a funding campaign for your project with milestone-based funding
                        </p>
                        <p className='font-semibold text-green-700 mb-6 text-base sm:text-lg'>
                            Smart funding. Milestone-driven success.
                        </p>

                        {/* Wallet Info */}
                        <div className='bg-white rounded-lg p-4 max-w-md mx-auto mb-6 border border-green-200'>
                            <div className='flex items-center justify-center gap-3 text-sm'>
                                <CheckCircle className='h-5 w-5 text-green-600' />
                                <span className='text-gray-600'>Connected:</span>
                                <span className='font-mono text-gray-800'>
                                    {`${connectedWallet.address.slice(0, 6)}...${connectedWallet.address.slice(-4)}`}
                                </span>
                            </div>
                        </div>

                        {/* Transaction Status */}
                        {transactionHash && (
                            <div className='bg-green-100 border border-green-300 rounded-lg p-4 max-w-2xl mx-auto mb-6'>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CheckCircle className='h-5 w-5 text-green-600' />
                                    <span className='text-green-800'>
                                        Transaction submitted:
                                        <a
                                            href={`https://venturepilot-2751721147387000-1.sagaexplorer.io:443/tx/${transactionHash}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='ml-2 underline hover:no-underline'
                                        >
                                            View on Explorer
                                        </a>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Card className='bg-white shadow-lg border-green-200'>
                        <CardHeader className='bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg'>
                            <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                                <DollarSign className='h-6 w-6' />
                                Project Details
                            </CardTitle>
                            <CardDescription className='text-green-100'>
                                Fill in your project information to start your funding campaign
                            </CardDescription>
                        </CardHeader>

                        <CardContent className='p-6 sm:p-8'>
                            <Form {...form}>
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)().catch(console.error);
                                    }}
                                    className='space-y-8'
                                >
                                    {/* Cover Image */}
                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name='coverUrl'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <Image className='h-5 w-5 text-green-600' />
                                                        Cover Image URL
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='https://example.com/cover-image.jpg'
                                                            className='h-12 text-lg border-green-200 focus:border-green-400 focus:ring-green-400'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Upload your project cover image to a service
                                                        like Imgur, then paste the URL here
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Project Name */}
                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name='projectName'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <User className='h-5 w-5 text-green-600' />
                                                        Project Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='My Amazing Project'
                                                            className='h-12 text-lg border-green-200 focus:border-green-400 focus:ring-green-400'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter a compelling name for your project
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Project Description */}
                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name='description'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <User className='h-5 w-5 text-green-600' />
                                                        Project Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder='Describe your project, its goals, and why people should fund it...'
                                                            className='min-h-32 border-green-200 focus:border-green-400 focus:ring-green-400'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Provide a detailed description of your
                                                        project (50-2000 characters)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                        className='grid grid-cols-1 md:grid-cols-2 gap-6'
                                    >
                                        {/* Website */}
                                        <FormField
                                            control={form.control}
                                            name='website'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <Globe className='h-5 w-5 text-green-600' />
                                                        Website
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='https://myproject.com'
                                                            className='h-12 text-lg border-green-200 focus:border-green-400 focus:ring-green-400'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Your project&apos;s website or landing page
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Category */}
                                        <FormField
                                            control={form.control}
                                            name='category'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <User className='h-5 w-5 text-green-600' />
                                                        Category
                                                    </FormLabel>
                                                    <FormControl>
                                                        <select
                                                            className='h-12 w-full text-lg border border-green-200 rounded-md px-3 focus:border-green-400 focus:ring-green-400 focus:outline-none'
                                                            {...field}
                                                        >
                                                            <option value=''>
                                                                Select a category
                                                            </option>
                                                            {CATEGORIES.map(category => (
                                                                <option
                                                                    key={category}
                                                                    value={category}
                                                                >
                                                                    {category}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Choose the category that best fits your
                                                        project
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                        className='grid grid-cols-1 md:grid-cols-2 gap-6'
                                    >
                                        {/* Funding Goal */}
                                        <FormField
                                            control={form.control}
                                            name='fundingGoal'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <DollarSign className='h-5 w-5 text-green-600' />
                                                        Funding Goal (USDC)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            placeholder='100000'
                                                            min={VALIDATION_LIMITS.MIN_FUNDING_GOAL}
                                                            max={VALIDATION_LIMITS.MAX_FUNDING_GOAL}
                                                            className='h-12 text-lg border-green-200 focus:border-green-400 focus:ring-green-400'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Amount in USDC you want to raise (
                                                        {VALIDATION_LIMITS.MIN_FUNDING_GOAL}-
                                                        {VALIDATION_LIMITS.MAX_FUNDING_GOAL} USDC)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Funding Deadline */}
                                        <FormField
                                            control={form.control}
                                            name='fundingDeadline'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center gap-2 text-lg font-semibold'>
                                                        <CalendarDays className='h-5 w-5 text-green-600' />
                                                        Funding Deadline
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='date'
                                                            min={today}
                                                            className='h-12 text-lg border-green-200 focus:border-green-400 focus:ring-green-400'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        When the funding period ends
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <Separator className='my-8 bg-green-200' />

                                    {/* Milestones Section */}
                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <div className='flex items-center justify-between mb-6'>
                                            <h3 className='text-xl font-semibold text-gray-900'>
                                                Project Milestones ({fields.length}/
                                                {VALIDATION_LIMITS.MAX_MILESTONES})
                                            </h3>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                size='sm'
                                                onClick={addMilestone}
                                                disabled={
                                                    fields.length >=
                                                    VALIDATION_LIMITS.MAX_MILESTONES
                                                }
                                                className='flex items-center gap-2 border-green-200 hover:bg-green-50 hover:border-green-400'
                                            >
                                                <Plus className='h-4 w-4' />
                                                Add Milestone
                                            </Button>
                                        </div>

                                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                                            <div className='flex items-start gap-3'>
                                                <AlertCircle className='h-5 w-5 text-blue-600 mt-0.5' />
                                                <div className='text-sm text-blue-800'>
                                                    <p className='font-medium mb-1'>Important:</p>
                                                    <p>
                                                        All milestone deadlines must be{' '}
                                                        <strong>after</strong> the funding deadline.
                                                        This ensures milestones are achieved after
                                                        the funding period ends.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <MilestoneForm
                                            control={form.control}
                                            fields={fields}
                                            onRemove={removeMilestone}
                                            today={today}
                                        />

                                        <MilestoneSummary
                                            watch={form.watch}
                                            fieldCount={fields.length}
                                        />
                                    </motion.div>

                                    <Separator className='my-8 bg-green-200' />

                                    {/* Submit Button */}
                                    <motion.div
                                        variants={ANIMATIONS.fadeInUp}
                                        initial='hidden'
                                        whileInView='visible'
                                        viewport={{ once: true, amount: 0.3 }}
                                        className='flex justify-center'
                                    >
                                        <Button
                                            type='submit'
                                            size='lg'
                                            disabled={isSubmitting}
                                            className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg font-semibold w-full sm:w-auto min-w-48'
                                        >
                                            {isSubmitting ? (
                                                <div className='flex items-center gap-2'>
                                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                                                    Creating Project...
                                                </div>
                                            ) : (
                                                'Create Project'
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
