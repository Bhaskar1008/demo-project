module.exports = [
    {
        User: {
        
            username: 'S',
            emailid: 'S',
            contact_number: 'N',
            password: 'S',
            location_name: 'S',
            is_active: 'BOOL',
            vehicle_id: 'SS',
            loan_id: 'SS',
            whishlist_id: 'SS',
            purchased_accessories_id: 'SS',
            loan_agreement_template: 'S',
            createdat: 'S',
            type: 's'
        }
    },
    {
        Vehicle: {
        
            vehicle_service_type: 'S',
            vehicle_type: 'S',
            vehicle_number: 'S',
            make: 'S',
            model: 'S',
            varient: 'S',
            year: 'S',
            color: 'S',
            registration_place: 'S',
            current_location: 'S',
            fuel_type: 'S',
            transmission_type: 'S',
            gares: 'N',
            price: 'N',
            vehicle_category: 'S',
            no_of_owners: 'N',
            engine_capcity_cc: 'S',
            vehicle_full_details: 'SS',
            vehicle_image_id: 'SS',
            createdat: 'S',
            createdby: 'S'
        }
    },
    {
        rentle_vehicle: {
        
            vehicle_id: 'S',
            pickup_location: 'S',
            pickup_time: 'S',
            customer_id: 'S',
            created_at: 'S'
        }
    },
    {
        Images: {
        
            image_name: 'S',
            image_file: 'S',
            uploaded_at: 'S',
            uploaded_by: 'S'
        }
    },
    {
        Loan: {
        
            lender_name: 'S',
            lender_logo: 'S',
            loan_required_details: 'S',
            lender_redirect_link: 'S',
            created_at: 'S',
            created_by: 'S'
        }
    },
    {
        Accessories: {
        
            accessories_name: 'S',
            model: 'S',
            type: 'S',
            description: 'S',
            price: 'N',
            image_1: 'S',
            image_2: 'S',
            image_3: 'S',
            image_4: 'S',
            image_5: 'S',
            created_at: 'S',
            created_by: 'S'
        }
    }
];


