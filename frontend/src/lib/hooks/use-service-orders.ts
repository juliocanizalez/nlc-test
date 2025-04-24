import { useState, useEffect, useCallback } from 'react';
import { serviceOrderService, ServiceOrder, ServiceOrderRequest } from '../api';

export function useServiceOrders(projectId?: number) {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await serviceOrderService.getAll(projectId);
      setServiceOrders(data);
    } catch (err) {
      console.error('Error fetching service orders:', err);
      setError('Failed to load service orders');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchServiceOrders();
  }, [fetchServiceOrders]);

  const createServiceOrder = async (serviceOrder: ServiceOrderRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newServiceOrder = await serviceOrderService.create(serviceOrder);
      setServiceOrders((prev) => [...prev, newServiceOrder]);
      return newServiceOrder;
    } catch (err) {
      console.error('Error creating service order:', err);
      setError('Failed to create service order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceOrder = async (
    id: number,
    serviceOrder: ServiceOrderRequest,
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedServiceOrder = await serviceOrderService.update(
        id,
        serviceOrder,
      );
      setServiceOrders((prev) =>
        prev.map((so) => (so.id === id ? updatedServiceOrder : so)),
      );
      return updatedServiceOrder;
    } catch (err) {
      console.error('Error updating service order:', err);
      setError('Failed to update service order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteServiceOrder = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await serviceOrderService.delete(id);
      setServiceOrders((prev) => prev.filter((so) => so.id !== id));
    } catch (err) {
      console.error('Error deleting service order:', err);
      setError('Failed to delete service order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    serviceOrders,
    isLoading,
    error,
    fetchServiceOrders,
    createServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
  };
}
