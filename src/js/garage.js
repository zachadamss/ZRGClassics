/**
 * ZRG Classics - Garage Module
 * Handles garage vehicles, restoration tracking, and maintenance records
 */

const Garage = {
  // Maximum vehicles per user
  MAX_VEHICLES: 10,

  // Platform info mapping
  PLATFORMS: {
    // BMW
    e28: { name: 'E28 5-Series', fullName: 'BMW E28 5-Series', brand: 'BMW', years: '1982-1988' },
    e30: { name: 'E30 3-Series', fullName: 'BMW E30 3-Series', brand: 'BMW', years: '1982-1994' },
    e34: { name: 'E34 5-Series', fullName: 'BMW E34 5-Series', brand: 'BMW', years: '1988-1996' },
    e36: { name: 'E36 3-Series', fullName: 'BMW E36 3-Series', brand: 'BMW', years: '1990-2000' },
    e39: { name: 'E39 5-Series', fullName: 'BMW E39 5-Series', brand: 'BMW', years: '1995-2004' },
    e46: { name: 'E46 3-Series', fullName: 'BMW E46 3-Series', brand: 'BMW', years: '1998-2006' },
    e90: { name: 'E90 3-Series', fullName: 'BMW E90 3-Series', brand: 'BMW', years: '2005-2013' },
    // Porsche
    '924': { name: '924', fullName: 'Porsche 924', brand: 'Porsche', years: '1976-1988' },
    '928': { name: '928', fullName: 'Porsche 928', brand: 'Porsche', years: '1977-1995' },
    '944': { name: '944', fullName: 'Porsche 944', brand: 'Porsche', years: '1982-1991' },
    '964': { name: '964 911', fullName: 'Porsche 964 911', brand: 'Porsche', years: '1989-1994' },
    '986': { name: '986 Boxster', fullName: 'Porsche 986 Boxster', brand: 'Porsche', years: '1996-2004' },
    '987': { name: '987 Boxster/Cayman', fullName: 'Porsche 987', brand: 'Porsche', years: '2005-2012' },
    '991': { name: '991 911', fullName: 'Porsche 991 911', brand: 'Porsche', years: '2011-2019' },
    '993': { name: '993 911', fullName: 'Porsche 993 911', brand: 'Porsche', years: '1994-1998' },
    '996': { name: '996 911', fullName: 'Porsche 996 911', brand: 'Porsche', years: '1997-2005' },
    '997': { name: '997 911', fullName: 'Porsche 997 911', brand: 'Porsche', years: '2004-2012' }
  },

  // ============================================
  // VEHICLES
  // ============================================

  /**
   * Get all vehicles for current user
   */
  async getVehicles() {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get single vehicle by ID
   */
  async getVehicle(vehicleId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_vehicles')
      .select('*')
      .eq('id', vehicleId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get vehicle count for current user
   */
  async getVehicleCount() {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { count, error } = await db
      .from('garage_vehicles')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Add a new vehicle
   */
  async addVehicle(vehicleData) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    // Check vehicle limit
    const count = await this.getVehicleCount();
    if (count >= this.MAX_VEHICLES) {
      throw new Error(`Vehicle limit reached (${this.MAX_VEHICLES} max)`);
    }

    const { data, error } = await db
      .from('garage_vehicles')
      .insert({
        user_id: user.id,
        platform: vehicleData.platform || null,
        make: vehicleData.make || null,
        model: vehicleData.model || null,
        year: vehicleData.year || null,
        nickname: vehicleData.nickname || null,
        color: vehicleData.color || null,
        vin: vehicleData.vin || null,
        mileage: vehicleData.mileage || null,
        purchase_date: vehicleData.purchaseDate || null,
        purchase_price: vehicleData.purchasePrice || null,
        notes: vehicleData.notes || null,
        photo_url: vehicleData.photoUrl || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a vehicle
   */
  async updateVehicle(vehicleId, updates) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const updateData = {
      updated_at: new Date().toISOString()
    };

    // Map camelCase to snake_case
    if (updates.platform !== undefined) updateData.platform = updates.platform;
    if (updates.make !== undefined) updateData.make = updates.make;
    if (updates.model !== undefined) updateData.model = updates.model;
    if (updates.year !== undefined) updateData.year = updates.year;
    if (updates.nickname !== undefined) updateData.nickname = updates.nickname;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.vin !== undefined) updateData.vin = updates.vin;
    if (updates.mileage !== undefined) updateData.mileage = updates.mileage;
    if (updates.purchaseDate !== undefined) updateData.purchase_date = updates.purchaseDate;
    if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl;

    const { data, error } = await db
      .from('garage_vehicles')
      .update(updateData)
      .eq('id', vehicleId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a vehicle
   */
  async deleteVehicle(vehicleId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await db
      .from('garage_vehicles')
      .delete()
      .eq('id', vehicleId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // ============================================
  // RESTORATION ITEMS
  // ============================================

  /**
   * Get all restoration items for a vehicle
   */
  async getRestorationItems(vehicleId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_restoration_items')
      .select('*')
      .eq('garage_vehicle_id', vehicleId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Convert to a map keyed by item_id for easy lookup
    const itemsMap = {};
    (data || []).forEach(item => {
      itemsMap[item.item_id] = {
        id: item.id,
        status: item.status || (item.completed ? 'complete' : 'not-started'),
        dateCompleted: item.date_completed,
        estimatedCost: item.estimated_cost ? parseFloat(item.estimated_cost) : 0,
        actualCost: item.actual_cost ? parseFloat(item.actual_cost) : 0,
        notes: item.notes,
        category: item.category,
        itemName: item.item_name
      };
    });
    return itemsMap;
  },

  /**
   * Update or create a restoration item (extended schema)
   */
  async updateRestorationItem(vehicleId, itemId, data) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const upsertData = {
      garage_vehicle_id: vehicleId,
      user_id: user.id,
      item_id: itemId,
      status: data.status || 'not-started',
      completed: data.status === 'complete',
      date_completed: data.status === 'complete' ? (data.dateCompleted || new Date().toISOString()) : null,
      estimated_cost: data.estimatedCost || 0,
      actual_cost: data.actualCost || 0,
      notes: data.notes || null,
      category: data.category || null,
      item_name: data.itemName || null,
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await db
      .from('garage_restoration_items')
      .upsert(upsertData, {
        onConflict: 'garage_vehicle_id,item_id'
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  /**
   * Bulk update restoration items for a vehicle
   */
  async bulkUpdateRestorationItems(vehicleId, items) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const upsertData = items.map(item => ({
      garage_vehicle_id: vehicleId,
      user_id: user.id,
      item_id: item.itemId,
      status: item.status || 'not-started',
      completed: item.status === 'complete',
      date_completed: item.status === 'complete' ? (item.dateCompleted || new Date().toISOString()) : null,
      estimated_cost: item.estimatedCost || 0,
      actual_cost: item.actualCost || 0,
      notes: item.notes || null,
      category: item.category || null,
      item_name: item.itemName || null,
      updated_at: new Date().toISOString()
    }));

    const { data: result, error } = await db
      .from('garage_restoration_items')
      .upsert(upsertData, {
        onConflict: 'garage_vehicle_id,item_id'
      })
      .select();

    if (error) throw error;
    return result;
  },

  /**
   * Clear all restoration progress for a vehicle
   */
  async clearRestoration(vehicleId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await db
      .from('garage_restoration_items')
      .delete()
      .eq('garage_vehicle_id', vehicleId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * Get restoration progress summary for a vehicle
   */
  async getRestorationProgress(vehicleId) {
    const items = await this.getRestorationItems(vehicleId);
    const values = Object.values(items);
    const completed = values.filter(i => i.status === 'complete').length;
    const inProgress = values.filter(i => i.status === 'in-progress').length;
    const skipped = values.filter(i => i.status === 'skipped').length;
    const totalEstimated = values.reduce((sum, i) => sum + (i.estimatedCost || 0), 0);
    const totalActual = values.reduce((sum, i) => sum + (i.actualCost || 0), 0);

    return {
      completedCount: completed,
      inProgressCount: inProgress,
      skippedCount: skipped,
      trackedCount: values.length,
      totalEstimated,
      totalActual
    };
  },

  // ============================================
  // MAINTENANCE SCHEDULE
  // ============================================

  /**
   * Get maintenance schedule for a vehicle
   */
  async getMaintenanceSchedule(vehicleId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_maintenance_schedule')
      .select('*')
      .eq('garage_vehicle_id', vehicleId)
      .eq('user_id', user.id)
      .order('name');

    if (error) throw error;
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      intervalMiles: item.interval_miles,
      intervalMonths: item.interval_months,
      lastServiceDate: item.last_service_date,
      lastServiceMileage: item.last_service_mileage
    }));
  },

  /**
   * Add a maintenance item
   */
  async addMaintenanceItem(vehicleId, itemData) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_maintenance_schedule')
      .insert({
        garage_vehicle_id: vehicleId,
        user_id: user.id,
        name: itemData.name,
        interval_miles: itemData.intervalMiles || null,
        interval_months: itemData.intervalMonths || null,
        last_service_date: itemData.lastServiceDate || null,
        last_service_mileage: itemData.lastServiceMileage || null
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      intervalMiles: data.interval_miles,
      intervalMonths: data.interval_months,
      lastServiceDate: data.last_service_date,
      lastServiceMileage: data.last_service_mileage
    };
  },

  /**
   * Update a maintenance item
   */
  async updateMaintenanceItem(itemId, updates) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.intervalMiles !== undefined) updateData.interval_miles = updates.intervalMiles;
    if (updates.intervalMonths !== undefined) updateData.interval_months = updates.intervalMonths;
    if (updates.lastServiceDate !== undefined) updateData.last_service_date = updates.lastServiceDate;
    if (updates.lastServiceMileage !== undefined) updateData.last_service_mileage = updates.lastServiceMileage;

    const { data, error } = await db
      .from('garage_maintenance_schedule')
      .update(updateData)
      .eq('id', itemId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      intervalMiles: data.interval_miles,
      intervalMonths: data.interval_months,
      lastServiceDate: data.last_service_date,
      lastServiceMileage: data.last_service_mileage
    };
  },

  /**
   * Delete a maintenance item
   */
  async deleteMaintenanceItem(itemId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await db
      .from('garage_maintenance_schedule')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * Initialize maintenance schedule with platform defaults
   */
  async initializeMaintenanceSchedule(vehicleId, platform) {
    const presets = this.getMaintenancePresets(platform);
    if (!presets || presets.length === 0) return;

    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const items = presets.map(preset => ({
      garage_vehicle_id: vehicleId,
      user_id: user.id,
      name: preset.name,
      interval_miles: preset.intervalMiles || null,
      interval_months: preset.intervalMonths || null,
      last_service_date: null,
      last_service_mileage: null
    }));

    const { error } = await db
      .from('garage_maintenance_schedule')
      .insert(items);

    if (error) throw error;
  },

  // ============================================
  // SERVICE HISTORY
  // ============================================

  /**
   * Get service history for a vehicle
   */
  async getServiceHistory(vehicleId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_service_history')
      .select('*')
      .eq('garage_vehicle_id', vehicleId)
      .eq('user_id', user.id)
      .order('service_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(record => ({
      id: record.id,
      maintenanceId: record.maintenance_id,
      serviceName: record.service_name,
      serviceDate: record.service_date,
      mileage: record.mileage,
      cost: record.cost ? parseFloat(record.cost) : null,
      shopType: record.shop_type,
      partsUsed: record.parts_used,
      notes: record.notes
    }));
  },

  /**
   * Add a service record
   */
  async addServiceRecord(vehicleId, recordData) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('garage_service_history')
      .insert({
        garage_vehicle_id: vehicleId,
        user_id: user.id,
        maintenance_id: recordData.maintenanceId || null,
        service_name: recordData.serviceName,
        service_date: recordData.serviceDate,
        mileage: recordData.mileage || null,
        cost: recordData.cost || null,
        shop_type: recordData.shopType || null,
        parts_used: recordData.partsUsed || null,
        notes: recordData.notes || null
      })
      .select()
      .single();

    if (error) throw error;

    // Update maintenance schedule if linked
    if (recordData.maintenanceId) {
      await this.updateMaintenanceItem(recordData.maintenanceId, {
        lastServiceDate: recordData.serviceDate,
        lastServiceMileage: recordData.mileage
      });
    }

    // Update vehicle mileage if higher
    if (recordData.mileage) {
      const vehicle = await this.getVehicle(vehicleId);
      if (!vehicle.mileage || recordData.mileage > vehicle.mileage) {
        await this.updateVehicle(vehicleId, { mileage: recordData.mileage });
      }
    }

    return {
      id: data.id,
      maintenanceId: data.maintenance_id,
      serviceName: data.service_name,
      serviceDate: data.service_date,
      mileage: data.mileage,
      cost: data.cost ? parseFloat(data.cost) : null,
      shopType: data.shop_type,
      partsUsed: data.parts_used,
      notes: data.notes
    };
  },

  /**
   * Update a service record
   */
  async updateServiceRecord(recordId, updates) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const updateData = {};
    if (updates.serviceName !== undefined) updateData.service_name = updates.serviceName;
    if (updates.serviceDate !== undefined) updateData.service_date = updates.serviceDate;
    if (updates.mileage !== undefined) updateData.mileage = updates.mileage;
    if (updates.cost !== undefined) updateData.cost = updates.cost;
    if (updates.shopType !== undefined) updateData.shop_type = updates.shopType;
    if (updates.partsUsed !== undefined) updateData.parts_used = updates.partsUsed;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { data, error } = await db
      .from('garage_service_history')
      .update(updateData)
      .eq('id', recordId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      maintenanceId: data.maintenance_id,
      serviceName: data.service_name,
      serviceDate: data.service_date,
      mileage: data.mileage,
      cost: data.cost ? parseFloat(data.cost) : null,
      shopType: data.shop_type,
      partsUsed: data.parts_used,
      notes: data.notes
    };
  },

  /**
   * Delete a service record
   */
  async deleteServiceRecord(recordId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await db
      .from('garage_service_history')
      .delete()
      .eq('id', recordId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Get platform info by code
   */
  getPlatformInfo(platformCode) {
    return this.PLATFORMS[platformCode] || {
      name: platformCode || 'Custom',
      fullName: platformCode || 'Custom Vehicle',
      brand: 'Custom',
      years: ''
    };
  },

  /**
   * Get display info for a vehicle (handles both platform and custom vehicles)
   */
  getVehicleDisplayInfo(vehicle) {
    if (vehicle.platform && this.PLATFORMS[vehicle.platform]) {
      // Platform-based vehicle
      const platformInfo = this.PLATFORMS[vehicle.platform];
      return {
        name: vehicle.nickname || `${vehicle.year || ''} ${platformInfo.fullName}`.trim(),
        badge: platformInfo.name,
        isCustom: false
      };
    } else {
      // Custom vehicle
      const yearMakeModel = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');
      return {
        name: vehicle.nickname || yearMakeModel || 'Custom Vehicle',
        badge: yearMakeModel || 'Custom',
        isCustom: true
      };
    }
  },

  /**
   * Get maintenance presets for a platform
   */
  getMaintenancePresets(platform) {
    const PRESETS = {
      e28: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 }
      ],
      e30: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt (M20/M42)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 }
      ],
      e34: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt (M20/M50)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 }
      ],
      e36: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'VANOS Seals Inspection', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 }
      ],
      e39: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'VANOS Seals', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Cooling System Overhaul', intervalMiles: 100000, intervalMonths: 120 }
      ],
      e46: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'VANOS Seals', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Rear Subframe Inspection', intervalMiles: 60000, intervalMonths: 72 }
      ],
      e90: [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Water Pump & Thermostat', intervalMiles: 80000, intervalMonths: 96 }
      ],
      '924': [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt', intervalMiles: 45000, intervalMonths: 48 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 30000, intervalMonths: 48 }
      ],
      '928': [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt', intervalMiles: 45000, intervalMonths: 48 },
        { name: 'Water Pump', intervalMiles: 45000, intervalMonths: 48 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 36 }
      ],
      '944': [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt & Rollers', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Balance Shaft Belt', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Water Pump', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60 }
      ],
      '964': [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 15000, intervalMonths: 24 }
      ],
      '986': [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'IMS Bearing Inspection', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'Convertible Top Inspection', intervalMiles: 30000, intervalMonths: 24 }
      ],
      '987': [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'IMS Bearing (Early 987)', intervalMiles: 50000, intervalMonths: 60 }
      ],
      '991': [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 40000, intervalMonths: 48 },
        { name: 'Cabin Filter', intervalMiles: 20000, intervalMonths: 24 },
        { name: 'Spark Plugs', intervalMiles: 40000, intervalMonths: 48 },
        { name: 'Coolant Flush', intervalMiles: 40000, intervalMonths: 48 },
        { name: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24 },
        { name: 'PDK Fluid', intervalMiles: 60000, intervalMonths: 72 }
      ],
      '993': [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 15000, intervalMonths: 24 }
      ],
      '996': [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'IMS Bearing Upgrade', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'RMS Seal Inspection', intervalMiles: 50000, intervalMonths: 60 }
      ],
      '997': [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'IMS Bearing (997.1)', intervalMiles: 50000, intervalMonths: 60 }
      ]
    };

    // Generic presets for custom vehicles
    const GENERIC_PRESETS = [
      { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
      { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
      { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
      { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
      { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
      { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
      { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
      { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
      { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
      { name: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12 }
    ];

    // Return platform-specific presets or generic presets for custom vehicles
    if (!platform) {
      return GENERIC_PRESETS;
    }
    return PRESETS[platform] || GENERIC_PRESETS;
  },

  /**
   * Format date for display
   */
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  /**
   * Calculate upcoming maintenance status
   */
  getUpcomingMaintenance(schedule, currentMileage) {
    const today = new Date();
    const results = [];

    schedule.forEach(item => {
      let nextDueMiles = null;
      let nextDueDate = null;
      let milesDue = null;
      let daysDue = null;

      if (item.intervalMiles && item.lastServiceMileage !== null) {
        nextDueMiles = item.lastServiceMileage + item.intervalMiles;
        milesDue = nextDueMiles - (currentMileage || 0);
      } else if (item.intervalMiles) {
        milesDue = -(currentMileage || 0);
      }

      if (item.intervalMonths && item.lastServiceDate) {
        const lastDate = new Date(item.lastServiceDate);
        nextDueDate = new Date(lastDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + item.intervalMonths);
        daysDue = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
      }

      let status = 'ok';
      const milesWarning = 1000;
      const daysWarning = 30;

      if ((milesDue !== null && milesDue < 0) || (daysDue !== null && daysDue < 0)) {
        status = 'overdue';
      } else if ((milesDue !== null && milesDue < milesWarning) || (daysDue !== null && daysDue < daysWarning)) {
        status = 'due-soon';
      }

      results.push({
        ...item,
        nextDueMiles,
        nextDueDate,
        milesDue,
        daysDue,
        status
      });
    });

    results.sort((a, b) => {
      const statusOrder = { 'overdue': 0, 'due-soon': 1, 'ok': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      const aMiles = a.milesDue ?? Infinity;
      const bMiles = b.milesDue ?? Infinity;
      return aMiles - bMiles;
    });

    return results;
  },

  // ============================================
  // INVOICE TEMPLATES
  // ============================================

  /**
   * Get all invoice templates for the current user
   */
  async getInvoiceTemplates() {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('invoice_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single invoice template
   */
  async getInvoiceTemplate(templateId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('invoice_templates')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Add a new invoice template
   */
  async addInvoiceTemplate(templateData) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    // If setting as default, unset other defaults first
    if (templateData.isDefault) {
      await db
        .from('invoice_templates')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await db
      .from('invoice_templates')
      .insert({
        user_id: user.id,
        name: templateData.name,
        shop_name: templateData.shopName || null,
        shop_address: templateData.shopAddress || null,
        shop_phone: templateData.shopPhone || null,
        shop_email: templateData.shopEmail || null,
        default_tax_rate: templateData.taxRate || 8.25,
        default_labor_rate: templateData.laborRate || 85.00,
        default_notes: templateData.notes || null,
        is_default: templateData.isDefault || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an invoice template
   */
  async updateInvoiceTemplate(templateId, updates) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    // If setting as default, unset other defaults first
    if (updates.isDefault) {
      await db
        .from('invoice_templates')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const updateData = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.shopName !== undefined) updateData.shop_name = updates.shopName;
    if (updates.shopAddress !== undefined) updateData.shop_address = updates.shopAddress;
    if (updates.shopPhone !== undefined) updateData.shop_phone = updates.shopPhone;
    if (updates.shopEmail !== undefined) updateData.shop_email = updates.shopEmail;
    if (updates.taxRate !== undefined) updateData.default_tax_rate = updates.taxRate;
    if (updates.laborRate !== undefined) updateData.default_labor_rate = updates.laborRate;
    if (updates.notes !== undefined) updateData.default_notes = updates.notes;
    if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;

    const { data, error } = await db
      .from('invoice_templates')
      .update(updateData)
      .eq('id', templateId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete an invoice template
   */
  async deleteInvoiceTemplate(templateId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await db
      .from('invoice_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * Get default invoice template
   */
  async getDefaultInvoiceTemplate() {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('invoice_templates')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data || null;
  },

  // ============================================
  // INVOICES
  // ============================================

  /**
   * Get all invoices for the current user
   */
  async getInvoices(options = {}) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    let query = db
      .from('invoices')
      .select('*')
      .eq('user_id', user.id);

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    query = query.order('invoice_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single invoice
   */
  async getInvoice(invoiceId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await db
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Generate next invoice number
   */
  async generateInvoiceNumber() {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Get count of invoices this month
    const startOfMonth = `${now.getFullYear()}-${month}-01`;
    const { count, error } = await db
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth);

    if (error) throw error;

    const sequence = String((count || 0) + 1).padStart(3, '0');
    return `INV-${year}${month}-${sequence}`;
  },

  /**
   * Save an invoice
   */
  async saveInvoice(invoiceData, invoiceId = null) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const record = {
      user_id: user.id,
      invoice_number: invoiceData.invoiceNumber,
      invoice_date: invoiceData.invoiceDate,
      status: invoiceData.status || 'draft',
      shop_name: invoiceData.shopName || null,
      shop_address: invoiceData.shopAddress || null,
      shop_phone: invoiceData.shopPhone || null,
      shop_email: invoiceData.shopEmail || null,
      customer_name: invoiceData.customerName || null,
      customer_address: invoiceData.customerAddress || null,
      customer_phone: invoiceData.customerPhone || null,
      customer_email: invoiceData.customerEmail || null,
      vehicle_year: invoiceData.vehicleYear || null,
      vehicle_make: invoiceData.vehicleMake || null,
      vehicle_model: invoiceData.vehicleModel || null,
      vehicle_vin: invoiceData.vehicleVin || null,
      vehicle_mileage: invoiceData.vehicleMileage || null,
      parts: invoiceData.parts || [],
      labor: invoiceData.labor || [],
      parts_subtotal: invoiceData.partsSubtotal || 0,
      labor_subtotal: invoiceData.laborSubtotal || 0,
      tax_rate: invoiceData.taxRate || 0,
      tax_amount: invoiceData.taxAmount || 0,
      grand_total: invoiceData.grandTotal || 0,
      notes: invoiceData.notes || null
    };

    let data, error;

    if (invoiceId) {
      // Update existing invoice
      ({ data, error } = await db
        .from('invoices')
        .update(record)
        .eq('id', invoiceId)
        .eq('user_id', user.id)
        .select()
        .single());
    } else {
      // Create new invoice
      ({ data, error } = await db
        .from('invoices')
        .insert(record)
        .select()
        .single());
    }

    if (error) throw error;
    return data;
  },

  /**
   * Delete an invoice
   */
  async deleteInvoice(invoiceId) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { error } = await db
      .from('invoices')
      .delete()
      .eq('id', invoiceId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * Get invoice stats for dashboard
   */
  async getInvoiceStats() {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data, error } = await db
      .from('invoices')
      .select('grand_total, status, created_at')
      .eq('user_id', user.id);

    if (error) throw error;

    const stats = {
      totalInvoices: data.length,
      thisMonth: 0,
      thisMonthTotal: 0,
      allTimeTotal: 0
    };

    data.forEach(inv => {
      stats.allTimeTotal += parseFloat(inv.grand_total) || 0;
      if (inv.created_at >= startOfMonth) {
        stats.thisMonth++;
        stats.thisMonthTotal += parseFloat(inv.grand_total) || 0;
      }
    });

    return stats;
  }
};

// Export for use in other modules
window.Garage = Garage;
